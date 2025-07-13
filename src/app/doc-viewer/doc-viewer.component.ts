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
  metadata: any = {};
  error: string | null = null;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.loading = true;
      this.error = null;
      this.markdown = '';
      this.metadata = {};
      const repo = params.get('repo');
      const slug = params.get('slug');
      if (!repo || !slug) {
        this.error = 'Invalid route';
        this.loading = false;
        return;
      }

      const url = `https://leisenfeld.com/${repo}/${slug}.md`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Document not found');
        let md = await res.text();

        // --- Extract JSON frontmatter ---
        const match = md.match(/^---\s*\n([\s\S]+?)\n---\s*\n?/);
        if (match) {
          try {
            this.metadata = JSON.parse(match[1]);
          } catch (e) {
            this.metadata = {};
          }
          md = md.slice(match[0].length); // Remove frontmatter block from md
        }
        this.markdown = md.trim();

      } catch (e: any) {
        this.error = e.message || 'Could not load doc';
      } finally {
        this.loading = false;
      }
    });
  }
}