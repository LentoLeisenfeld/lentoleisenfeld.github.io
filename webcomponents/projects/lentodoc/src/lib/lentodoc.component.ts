import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAPIV3_1 } from 'openapi-types';

@Component({
  selector: 'lentodoc',
  templateUrl: './lentodoc.component.html',
  styleUrl: './lentodoc.component.scss',
  imports: [CommonModule, FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LentoDocComponent {
  private _specification: OpenAPIV3_1.Document | null = null;

  @Input()
  set spec(val: OpenAPIV3_1.Document | null) {
    this._specification = val;
    console.log('set', this._specification);
  }

  get spec(): OpenAPIV3_1.Document | null {
    return this._specification;
  }
}