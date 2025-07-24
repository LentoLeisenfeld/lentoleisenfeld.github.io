import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'php',
    standalone: true,
})
export class PhpHighlightPipe implements PipeTransform {

    private keywords = [
        'function', 'echo', 'if', 'else', 'elseif', 'return', 'public', 'private', 'protected',
        'static', 'var', 'new', 'class', 'extends', 'implements', 'interface', 'use', 'namespace',
        'throw', 'try', 'catch', 'finally', 'while', 'for', 'foreach', 'switch', 'case', 'default',
        'break', 'continue', 'const', 'abstract', 'final', 'global', 'isset', 'empty', 'unset',
        'clone', 'instanceof', 'yield', 'print', 'require', 'include', 'require_once', 'include_once',
        'declare', 'as', 'list', 'array', 'or', 'and', 'xor', 'die', 'exit', 'goto', 'endif', 'endwhile',
        'endforeach', 'endswitch', 'endfor'
    ];
    private types = [
        'int', 'float', 'string', 'bool', 'array', 'object', 'callable', 'iterable', 'void', 'mixed', 'self', 'parent'
    ];
    private constants = ['true', 'false', 'null'];
    private magicConsts = [
        '__CLASS__', '__DIR__', '__FILE__', '__FUNCTION__', '__LINE__', '__METHOD__', '__NAMESPACE__', '__TRAIT__'
    ];

    private keywordPattern = this.makeWordPattern(this.keywords, 'g');
    private typePattern = this.makeWordPattern(this.types, 'g');
    private constantPattern = this.makeWordPattern(this.constants, 'gi');
    private magicPattern = this.makeWordPattern(this.magicConsts, 'g');

    private makeWordPattern(words: string[], flags: string): RegExp {
        return new RegExp(`\\b(${words.map(w => w.replace(/([.*+?^=!:${}()|[\]\\])/g, '\\$1')).join('|')})\\b`, flags);
    }

    transform(code: string): string {
        if (!code) return '';

        // Only escape HTML special chars, nothing else
        code = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Tokenize on the REAL code (never touch whitespace or newlines)
        const tokenPattern = new RegExp([
            '(?<use>use\\s+[a-zA-Z0-9_\\\\]+(?:\\s*\\{[^}]+\\})?;)',
            '(?<magic>__\\w+__)',
            '|(?<attribute>#\\[\\s*[A-Za-z_]\\w*(\\([^\\)]*\\))?\\s*\\])',
            '|(?<comment>//.*|#.*|/\\*[\\s\\S]*?\\*/)',
            '|(?<string>\'(?:\\\\\'|[^\'])*\'|"(?:\\\\\"|[^"])*")',
            '|(?<phptag>&lt;\\?php|\\?&gt;)',
            '|(?<variable>\\$[a-zA-Z_]\\w*)',
            '|(?<number>\\b\\d+(\\.\\d+)?\\b)',
            '|(?<nullabletype>\\?[a-zA-Z_][a-zA-Z0-9_]*)',
            '|(?<func>[a-zA-Z_]\\w*(?=\\())',
            '|(?<classname>(?<=class|interface|trait|new)\\s+[A-Z][A-Za-z0-9_]*)',
            '|(?<operator>==|===|!=|!==|->|=>|<=|>=|<>|&&|\\|\\||\\+\\+|--|\\+|-|\\*|\\/|%|\\^|\\.|,|;|=|<|>)',
            '|(?<constant>\\btrue\\b|\\bfalse\\b|\\bnull\\b)'
        ].join(''), 'g');

        let lastIndex = 0;
        let result = '';
        let match: RegExpExecArray | null;

        while ((match = tokenPattern.exec(code)) !== null) {
            if (lastIndex < match.index) {
                result += this.highlightPlain(code.slice(lastIndex, match.index));
            }
            const groups = match.groups as Record<string, string>;
            result += this.renderToken(groups);
            lastIndex = tokenPattern.lastIndex;
        }
        if (lastIndex < code.length) {
            result += this.highlightPlain(code.slice(lastIndex));
        }

        // DO NOT replace spaces, tabs, or newlines!
        // Just let <pre> or 'white-space: pre' in CSS handle all formatting

        return result;
    }

    private renderToken(groups: Record<string, string>): string {
        if (groups['use']) {
            // Highlight 'use', namespace, group imports, and semicolon
            return groups['use']
                .replace(/^use\s+/, m => `<span class="text-yellow-400 font-bold">${m}</span>`)
                .replace(/([a-zA-Z0-9_\\]+)(?=\s*\{|\;)/, m => `<span class="text-blue-700">${m}</span>`)
                .replace(/\{([^}]+)\}/g, (m, inner) =>
                    `<span class="text-gray-500">{</span><span class="text-blue-600">${inner.replace(/,(\s*)/g, '<span class="text-gray-100">,</span>$1')}</span><span class="text-gray-500">}</span>`
                )
                .replace(/;$/, `<span class="text-gray-900">;</span>`);
        }
        if (groups['magic']) return `<span class="text-purple-400">${groups['magic']}</span>`;
        if (groups['attribute']) return this.highlightAttribute(groups['attribute']);
        if (groups['comment']) return `<span class="text-green-600 italic">${groups['comment']}</span>`;
        if (groups['string']) return `<span class="text-orange-700">${groups['string']}</span>`;
        if (groups['phptag']) return `<span class="text-red-200 font-bold">${groups['phptag']}</span>`;
        if (groups['variable']) return `<span class="text-blue-400">${groups['variable']}</span>`;
        if (groups['number']) return `<span class="text-orange-500">${groups['number']}</span>`;
        if (groups['nullabletype']) {
            const nullable = groups['nullabletype'];
            return `<span class="text-gray-700">?</span><span class="text-blue-500 font-semibold">${nullable.slice(1)}</span>`;
        }
        if (groups['func']) return `<span class="text-yellow-200">${groups['func']}</span>`;
        if (groups['classname']) return `<span class="text-green-400">${groups['classname']}</span>`;
        if (groups['operator']) return `<span class="text-gray-800">${groups['operator']}</span>`;
        if (groups['constant']) return `<span class="text-indigo-400 font-bold">${groups['constant']}</span>`;
        return '';
    }

    private highlightPlain(text: string): string {
        text = text.replace(this.magicPattern, `<span class="text-purple-400">$1</span>`);
        text = text.replace(this.typePattern, `<span class="text-blue-500 font-semibold">$1</span>`);
        text = text.replace(this.constantPattern, `<span class="text-indigo-400 font-bold">$1</span>`);
        text = text.replace(this.keywordPattern, `<span class="use-block text-blue-600 font-bold">$1</span>`);
        return text;
    }

    private highlightAttribute(attr: string): string {
        const attrMatch = /^#\[\s*([A-Za-z_]\w*)\s*(\(([\s\S]*)\))?\s*\]$/.exec(attr);
        if (!attrMatch) return `<span class="text-pink-200 italic">${attr}</span>`;
        const [, name, , args] = attrMatch;
        let highlighted = `<span class="text-gray-300">#[</span>`;
        highlighted += `<span class="text-pink-400 font-bold">${name}</span>`;
        if (args !== undefined) {
            highlighted += `<span class="text-purple-700">(</span>`;
            highlighted += this.highlightAttributeArgs(args);
            highlighted += `<span class="text-purple-200">)</span>`;
        }
        highlighted += `<span class="text-gray-300">]</span>`;
        return highlighted;
    }

    private highlightAttributeArgs(args: string): string {
        return args.replace(/('[^']*'|"[^"]*"|\[|\]|\d+|\w+|,|\s+|\(|\))/g, match => {
            if (/^'.*'$|^".*"$/.test(match)) return `<span class="text-green-500">${match}</span>`;
            if (/^\d+$/.test(match)) return `<span class="text-orange-400">${match}</span>`;
            if (/^\[|\]$/.test(match)) return `<span class="text-gray-400 font-bold">${match}</span>`;
            if (/^,$/.test(match)) return `<span class="text-gray-300">${match}</span>`;
            if (/^\w+$/.test(match)) return `<span class="text-blue-400">${match}</span>`;
            if (/^\($|^\)$/.test(match)) return `<span class="text-purple-700">${match}</span>`;
            return match;
        });
    }
}
