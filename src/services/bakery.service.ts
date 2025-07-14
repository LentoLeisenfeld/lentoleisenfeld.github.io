import { Injectable } from '@angular/core';
import type { OpenAPIV3_1 } from 'openapi-types';

@Injectable({ providedIn: 'root' })
export class BakeryApiService {
  async getSpec(): Promise<OpenAPIV3_1.Document> {
    const response = await fetch('/bakery.json');
    if (!response.ok) {
      throw new Error('Failed to load bakery OpenAPI spec');
    }
    return response.json() as Promise<OpenAPIV3_1.Document>;
  }
}