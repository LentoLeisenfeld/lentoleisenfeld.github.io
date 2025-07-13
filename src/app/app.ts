import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SearchService } from '../services/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [

  ]
})
export class App {
  loading = true;
  protected title = 'test';


  constructor(public searchService: SearchService) { }

  async ngOnInit() {
    await this.searchService.loadIndex();
    this.loading = false;
  }
}
