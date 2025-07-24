import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'legal',
    imports: [CommonModule, FormsModule],
    templateUrl: './legal.component.html',
    styleUrl: './legal.component.scss',
    standalone: true,
})
export class LegalComponent {
    a = this.random();
    b = this.random();
    answer: number | null = null;
    good = false;

    check() {
        this.good = this.answer === this.a + this.b;
    }
    get questionDe(): string {
        return `Was ist ${this.a} + ${this.b}?`;
    }
    get questionEn(): string {
        return `What is ${this.a} + ${this.b}?`;
    }
    private random(): number {
        return Math.floor(Math.random() * 10) + 1;
    }
}