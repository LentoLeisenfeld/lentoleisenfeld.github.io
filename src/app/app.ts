import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LentoDocComponent } from '../components/lentodoc.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LentoDocComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [

  ]
})
export class App {
  protected title = 'test';
}
