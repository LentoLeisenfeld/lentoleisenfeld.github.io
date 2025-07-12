import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
    // Each key is a source (URL), value is the array of docs for that repo
    public indexes: { [source: string]: any[] } = {};
    private ready = false;

    async loadIndex(): Promise<void> {
        if (this.ready) return;

        // 1. Load config.json
        const configRes = await fetch('/config.json');
        if (!configRes.ok) throw new Error('config.json not found');
        const config = await configRes.json();
        const urls: string[] = config?.sources || [];

        // 2. Fetch all index.json files in parallel, and keep mapping
        const fetches = await Promise.all(
            urls.map(async url => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return { url, docs: [] };
                    const docs = await res.json();
                    return { url, docs };
                } catch {
                    return { url, docs: [] };
                }
            })
        );

        console.log(fetches);

        // Build the indexed map
        this.indexes = {};
        fetches.forEach(({ url, docs }) => {
            this.indexes[url] = docs;
        });

        this.ready = true;
    }

    // Search in all repositories, returning a result object per repo
    search(query: string): { [source: string]: any[] } {
        const q = query.toLowerCase();
        const results: { [source: string]: any[] } = {};

        for (const source in this.indexes) {
            results[source] = this.indexes[source].filter(
                doc =>
                    doc.title?.toLowerCase().includes(q) ||
                    doc.excerpt?.toLowerCase().includes(q) ||
                    (doc.tags || []).some((t: string) => t.toLowerCase().includes(q))
            );
        }

        return results;
    }

    get indexDocs() {
        return Object.entries(this.indexes).map(([source, docs]) => {
            const indexDoc = docs.find(doc => doc.slug === 'index');
            return { source, doc: indexDoc };
        }).filter(x => x.doc);
    }
}
