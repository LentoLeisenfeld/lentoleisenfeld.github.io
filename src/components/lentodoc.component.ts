import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'openapi-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="error" class="openapi-error">{{error}}</div>
    <div *ngIf="!error && !_spec">Loading OpenAPI spec...</div>
    <div *ngIf="_spec">
      <h1>{{_spec.info?.title || 'OpenAPI Spec'}}</h1>
      <div>
        <strong>Version:</strong> {{_spec.info?.version}}<br>
        <strong>Description:</strong>
        <div [innerHTML]="_spec.info?.description"></div>
      </div>
      <h2>Endpoints</h2>
      <div *ngIf="_spec.paths">
        <div *ngFor="let path of objectKeys(_spec.paths)">
          <strong>{{path}}</strong>
          <ul>
            <li *ngFor="let method of objectKeys(_spec.paths[path])">
              <strong>{{method.toUpperCase()}}</strong>:
              {{_spec.paths[path][method]?.summary || ''}}
            </li>
          </ul>
        </div>
      </div>
      <h2>Schemas</h2>
      <div *ngIf="_spec.components?.schemas">
        <div *ngFor="let schemaName of objectKeys(_spec.components.schemas)">
          <details>
            <summary><strong>{{schemaName}}</strong></summary>
            <pre>{{_spec.components.schemas[schemaName] | json}}</pre>
          </details>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .openapi-error { color: red; font-weight: bold; }
    :host { font-family: ui-sans-serif, sans-serif; display: block; background: #fafafa; border: 1px solid #eee; padding: 1rem; border-radius: 8px; }
    h1, h2 { margin-top: 1rem; }
    ul { margin: 0; padding-left: 1.2rem; }
    pre { background: #f7f7f7; padding: 0.5rem; border-radius: 6px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LentoDocComponent {
  _spec: any = null;    // <-- for parsed object
  public error: string = '';
  private _specInput: string = '';

  @Input()
  set spec(val: string) {
    this._specInput = val;
    this.processSpecInput(val);
  }

  get spec() {
    return this._specInput;
  }

  objectKeys = Object.keys;

  constructor(private cdr: ChangeDetectorRef) {}

  async processSpecInput(val: string) {
    this.error = '';
    this._spec = null;
    if (!val) {
      this.error = 'No spec provided.';
      return;
    }
    try {
      if (/^https?:\/\//.test(val.trim())) {
        const resp = await fetch(val.trim());
        if (!resp.ok) throw new Error(`Failed to fetch spec: ${resp.status}`);
        this._spec = await resp.json();
      } else {
        this._spec = JSON.parse(val.trim());
      }
      console.log(this._spec);
      this.cdr.markForCheck();
      if (!this._spec.openapi) throw new Error('Not a valid OpenAPI spec');
    } catch (e: any) {
      this.error = 'Error parsing spec: ' + e.message;
    }
  }
}