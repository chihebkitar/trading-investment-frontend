// src/app/components/crypto-home/crypto-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Crypto } from 'src/app/models/crypto.model';
import { CryptoService } from 'src/app/services/crypto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-crypto-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crypto-home.component.html',
  styleUrls: ['./crypto-home.component.scss']
})
export class CryptoHomeComponent implements OnInit {
  trendingCryptos: Crypto[] = [];
  searchResults: Crypto[] = [];
  query: string = '';

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending() {
    this.cryptoService.getTrendingCryptos()
      .subscribe({
        next: (cryptos) => (this.trendingCryptos = cryptos),
        error: (err) => console.error(err)
      });
  }

  search() {
    if (!this.query.trim()) {
      this.searchResults = [];
      return;
    }
    this.cryptoService.searchCryptos(this.query).subscribe({
      next: (results) => (this.searchResults = results),
      error: (err) => console.error(err)
    });
  }
}
