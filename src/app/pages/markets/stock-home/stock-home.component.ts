import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-stock-home',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './stock-home.component.html',
  styleUrls: ['./stock-home.component.scss']
})
export class StockHomeComponent implements OnInit {
  trendingStocks: Stock[] = [];
  searchResults: Stock[] = [];
  query: string = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending() {
    this.stockService.getTrendingStocks()
      .subscribe({
        next: (stocks) => (this.trendingStocks = stocks),
        error: (err) => console.error(err)
      });
  }

  search() {
    if (!this.query.trim()) {
      this.searchResults = [];
      return;
    }
    this.stockService.searchStocks(this.query).subscribe({
      next: (results) => (this.searchResults = results),
      error: (err) => console.error(err)
    });
  }
}
