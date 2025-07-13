import { Injectable } from '@angular/core';

export interface Doc {
  slug: string;
  title?: string;
  formattedTitle?: string;
  excerpt?: string;
  tags?: string[];
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  // Map from repo/source URL to array of docs
  public indexes: { [source: string]: Doc[] } = {};
  private ready = false;

  async loadIndex(): Promise<void> {
    if (this.ready) return;

    // Load config.json (use /assets if that's your path!)
    const configRes = await fetch('/config.json');
    if (!configRes.ok) throw new Error('config.json not found');
    const config = await configRes.json();
    const urls: string[] = config?.sources || config?.searchIndexes || [];

    // Fetch all index.json files in parallel, mapped by source
    const fetches = await Promise.all(
      urls.map(async url => {
        try {
          const res = await fetch(url);
          if (!res.ok) return { url, docs: [] };
          const docs: Doc[] = await res.json();
          return { url, docs };
        } catch {
          return { url, docs: [] };
        }
      })
    );

    // Build the indexed map
    this.indexes = {};
    fetches.forEach(({ url, docs }) => {
      this.indexes[url] = docs;
    });

    this.ready = true;
  }

  // Search per repository, returns a map of results by source
  search(query: string): { [source: string]: Doc[] } {
    const q = query.toLowerCase();
    const results: { [source: string]: Doc[] } = {};

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

  // All docs with slug === 'index' for each source, with safe typing
  get indexDocs(): { repo: string; doc: Doc }[] {
    return Object.entries(this.indexes)
      .map(([source, docs]) => {
        const repo = this.repoFromUrl(source);
        const doc = docs.find(d => d.slug === 'index');
        return doc ? { repo, doc } : undefined;
      })
      .filter((item): item is { repo: string; doc: Doc } => !!item);
  }

  repoFromUrl(url: string) {
    // e.g. https://leisenfeld.com/LentoApi/index.json --> 'LentoApi'
    return url.split('/').slice(-2, -1)[0];
  }
}
