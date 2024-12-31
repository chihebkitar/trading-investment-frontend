// src/app/components/forex-home/forex-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Forex } from 'src/app/models/forex.model';
import { ForexService } from 'src/app/services/forex.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forex-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forex-home.component.html',
  styleUrls: ['./forex-home.component.scss']
})
export class ForexHomeComponent implements OnInit {
  trendingForex: Forex[] = [];
  searchResults: Forex[] = [];
  query: string = '';

  constructor(private forexService: ForexService) {}

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending() {
    this.forexService.getTrendingForex()
      .subscribe({
        next: (pairs) => (this.trendingForex = pairs),
        error: (err) => console.error(err)
      });
  }

  search() {
    if (!this.query.trim()) {
      this.searchResults = [];
      return;
    }
    this.forexService.searchForex(this.query).subscribe({
      next: (results) => (this.searchResults = results),
      error: (err) => console.error(err)
    });
  }
}
