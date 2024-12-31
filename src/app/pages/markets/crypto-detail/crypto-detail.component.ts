// src/app/components/crypto-detail/crypto-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Crypto } from 'src/app/models/crypto.model';
import { CryptoService } from 'src/app/services/crypto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    RouterModule,
    NgApexchartsModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './crypto-detail.component.html',
  styleUrls: ['./crypto-detail.component.scss']
})
export class CryptoDetailComponent implements OnInit {
  crypto: Crypto | null = null;
  symbol: string = '';

  // Chart stuff
  chartType: ChartType = 'line';
  chartData: any = {};
  chartOptions: ChartOptions = { responsive: true };

  // Apex candlestick
  candlestickOptions: ApexOptions = {
    chart: { type: 'candlestick', height: 350 },
    title: { text: 'Price Candlestick', align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { tooltip: { enabled: true } },
    series: []
  };

  // Interval for fetching historical data
  currentInterval: string = '1mo';

  // For placing orders
  userId = 1; // or dynamically get from auth
  orderForm!: FormGroup;

  private historyData: any[] = [];  

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private sharedService: SharedService 
  ) {}

  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';
    this.loadCrypto();

    // Build order form (BUY or SELL, plus quantity or amount)
    this.orderForm = this.fb.group({
      orderType: ['BUY', Validators.required],
      quantity: [0],
      amount: [0]
    });
  }

  loadCrypto() {
    this.cryptoService.getCrypto(this.symbol).subscribe({
      next: (res) => {
        this.crypto = res;
        this.loadHistory();
      },
      error: (err) => console.error('Error loading crypto:', err)
    });
  }

  loadHistory() {
    this.cryptoService.getCryptoHistory(this.symbol, this.currentInterval)
      .subscribe({
        next: (res) => {
          this.historyData = res.history || [];
          this.buildCharts(this.historyData);
        },
        error: (err) => console.error('Error loading history:', err)
      });
  }

  buildCharts(history: any[]) {
    // If no data or history is missing, we can short-circuit
    if (!history || history.length < 1) {
      // Clear charts => prevents apexcharts error
      this.candlestickOptions = {
        ...this.candlestickOptions,
        series: []
      };
      this.chartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    // Candle data
    const candleData = history.map((bar: any) => {
      const dateVal = new Date(bar.Date).getTime();
      return {
        x: dateVal,
        y: [bar.Open, bar.High, bar.Low, bar.Close]
      };
    });

    this.candlestickOptions = {
      ...this.candlestickOptions,
      series: [{
        name: this.symbol,
        data: candleData
      }]
    };

    // Line chart from close prices
    const labels = history.map((bar: any) => new Date(bar.Date).toLocaleDateString());
    const closes = history.map((bar: any) => bar.Close);

    this.chartData = {
      labels,
      datasets: [
        {
          label: `${this.symbol} Close`,
          data: closes,
          borderColor: '#00A1FF',
          backgroundColor: '#DAF1FF',
          fill: false
        }
      ]
    };
  }

  onIntervalChange(interval: string) {
    this.currentInterval = interval;
    this.loadHistory();
  }

  /**
   * Full placeOrder:
   *   - orderType: BUY/SELL
   *   - quantity, amount => optional
   */
  placeOrder() {
    if (!this.crypto) {
      alert('No crypto loaded!');
      return;
    }
    const { orderType, quantity, amount } = this.orderForm.value;

    // Call the back-end order endpoint
    this.orderService.placeOrder(
      this.userId,
      this.crypto.symbol,   // e.g. "BTC-USD"
      orderType,            // "BUY" or "SELL"
      quantity,             
      amount                
    ).subscribe({
      next: (res) => {
        alert(`Order Placed!\nType=${res.orderType}\nPrice=${res.price}\nTotal=${res.totalAmount}`);
        this.sharedService.triggerRefresh(); // refresh portfolio
      },
      error: (err) => {
        console.error('Order error:', err);
        alert('Error placing order: ' + err.error?.message || err.message);
      }
    });
  }
}
