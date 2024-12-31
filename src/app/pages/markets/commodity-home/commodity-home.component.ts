import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommodityService } from 'src/app/services/commodity.service';
import { Asset } from 'src/app/models/asset'; // or your Commodity interface

@Component({
  selector: 'app-commodity-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './commodity-home.component.html',
  styleUrls: ['./commodity-home.component.scss']
})
export class CommodityHomeComponent implements OnInit {
  trendingCommodities: Asset[] = [];
  searchResults: Asset[] = [];
  query: string = '';

  constructor(private commodityService: CommodityService) {}

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending() {
    this.commodityService.getTrendingCommodities()
      .subscribe({
        next: (commodities) => (this.trendingCommodities = commodities),
        error: (err) => console.error(err)
      });
  }

  search() {
    if (!this.query.trim()) {
      this.searchResults = [];
      return;
    }
    this.commodityService.searchCommodities(this.query).subscribe({
      next: (results) => (this.searchResults = results),
      error: (err) => console.error(err)
    });
  }
}
