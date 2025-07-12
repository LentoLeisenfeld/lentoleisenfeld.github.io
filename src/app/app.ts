import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LentoDocComponent } from '../components/lentodoc.component';
import { SearchService } from '../services/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LentoDocComponent, CommonModule],
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
