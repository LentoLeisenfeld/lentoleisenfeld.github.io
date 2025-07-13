import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemarkModule } from 'ngx-remark';

@Component({
  selector: 'docviewer',
  imports: [CommonModule, RemarkModule],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.scss',
  standalone: true
})
export class DocViewerComponent implements OnInit {
  loading = true;
  markdown: string = '';
  error: string | null = null;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.loading = true;
      this.error = null;
      this.markdown = '';
      const repo = params.get('repo');
      const slug = params.get('slug');
      if (!repo || !slug) {
        this.error = 'Invalid route';
        this.loading = false;
        return;
      }

      // Build the .md file URL—customize this for your hosting structure!
      const url = `https://leisenfeld.com/${repo}/${slug}.md`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Document not found');
        this.markdown = await res.text();
      } catch (e: any) {
        this.error = e.message || 'Could not load doc';
      } finally {
        this.loading = false;
      }
    });
  }

  // **Replace this with your real markdown renderer!**
  basicMarkdownToHtml(md: string): string {
    // Super-basic: convert # headers and linebreaks (not production-ready!)
    return md
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\n/g, '<br>');
  }
}