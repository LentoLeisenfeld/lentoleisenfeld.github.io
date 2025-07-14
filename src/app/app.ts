import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SearchService } from '../services/search.service';
import { CommonModule } from '@angular/common';
import { LentoDocComponent } from "../components/lentodoc.component";
import { OpenAPIV3_1 } from 'openapi-types';
import { BakeryApiService } from '../services/bakery.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule, LentoDocComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [

  ]
})
export class App implements OnInit {
  loading = true;
  protected title = 'test';

  spec: OpenAPIV3_1.Document | null = null;

  constructor(public searchService: SearchService,
    private bakeryApi: BakeryApiService
  ) { }

  async ngOnInit() {
    try {
      this.spec = await this.bakeryApi.getSpec();
      console.log(this.spec);
    } catch (err) {
      this.spec = null;
    }

    await this.searchService.loadIndex();
    this.loading = false;
  }

  sidebarOpen = false;

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
