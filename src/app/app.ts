import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SearchService } from '../services/search.service';
import { CommonModule } from '@angular/common';
import { OpenAPIV3_1 } from 'openapi-types';
import { BakeryApiService } from '../services/bakery.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [

  ]
})
export class App implements OnInit {
  protected title = 'test';
  public sidebarOpen = false;

  constructor(public searchService: SearchService) { }

  async ngOnInit() {
    await this.searchService.loadIndex();
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
