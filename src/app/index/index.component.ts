import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SearchService } from '@services/search.service';
import { BakeryApiService } from '@services/bakery.service';
import { OpenAPIV3_1 } from 'openapi-types';
import { LentoDocComponent } from '@lentodoc/src/lib/lentodoc.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  imports: [LentoDocComponent, FormsModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  standalone: true,
})
export class IndexComponent implements OnInit, OnChanges {
  editorOptions = { theme: 'vs-dark', language: 'typescript' };
  code: string = 'function x() {\n\tconsole.log("Hello world!");\n}';
  code2: string = '';

  spec: OpenAPIV3_1.Document | null = null;
  loading = true;
  highlighted = '';
  constructor(
    public searchService: SearchService,
    private bakeryApi: BakeryApiService
  ) {
    this.code2 = `
use Lento\\Http\\Attributes\\Get;
use Lento\\Routing\\Attributes\\{Controller, Service};
use Lento\\OpenAPI\\Attributes\\{Tags, Summary};

#[Controller('/products')]
#[Tags('products')]
class ProductsController
{
    #[Service]
    public ProductService $productService;

    #[Get]
    #[Summary('List all products')]
    public function get(): array
    {
        return $this->productService->getAllProducts();
    }
}`;

  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.code2) {

    } else {
      this.highlighted = '';
    }
  }
  copyCode() {
    navigator.clipboard.writeText(this.code2);
  }
  async ngOnInit() {
    this.spec = await this.bakeryApi.getSpec();
    await this.searchService.loadIndex();
    console.log(this.searchService.indexes, this.searchService.indexDocs);
    this.loading = false;
  }
}
