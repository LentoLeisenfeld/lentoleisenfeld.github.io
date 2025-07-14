import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenAPIV3_1 } from 'openapi-types';

@Component({
  selector: 'lentodoc',
  templateUrl: './lentodoc.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
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