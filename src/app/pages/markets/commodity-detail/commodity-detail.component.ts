import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChartOptions, ChartType } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CommodityService } from 'src/app/services/commodity.service';
import { OrderService } from 'src/app/services/order.service';
import { SharedService } from 'src/app/services/shared.service';
import { Asset } from 'src/app/models/asset';

@Component({
  selector: 'app-commodity-detail',
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
  templateUrl: './commodity-detail.component.html',
  styleUrls: ['./commodity-detail.component.scss']
})
export class CommodityDetailComponent implements OnInit {
  commodity: Asset | null = null;
  symbol: string = '';

  // ng2-charts line chart
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

  // For the chart intervals
  currentInterval: string = '1mo';

  // For placing orders
  userId = 1; // from your auth or something
  orderForm!: FormGroup;

  // Storing historical data
  private historyData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private commodityService: CommodityService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';
    this.loadCommodity();

    // Build the order form
    this.orderForm = this.fb.group({
      orderType: ['BUY', Validators.required],
      quantity: [0],
      amount: [0]
    });
  }

  loadCommodity() {
    this.commodityService.getCommodity(this.symbol).subscribe({
      next: (res) => {
        this.commodity = res;
        this.loadHistory();
      },
      error: (err) => console.error('Error loading commodity:', err)
    });
  }

  loadHistory() {
    // If you have a custom endpoint for commodity history, call it here:
    this.commodityService.getCommodityHistory(this.symbol, this.currentInterval)
      .subscribe({
        next: (res) => {
          this.historyData = res.history || [];
          this.buildCharts(this.historyData);
        },
        error: (err) => console.error('Error loading commodity history:', err)
      });
  }

  buildCharts(history: any[]) {
    // If no data, clear:
    if (!history || history.length < 1) {
      this.candlestickOptions = { ...this.candlestickOptions, series: [] };
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    // Build candlestick data
    const candleData = history.map(bar => {
      const dateVal = new Date(bar.Date).getTime();
      return {
        x: dateVal,
        y: [bar.Open, bar.High, bar.Low, bar.Close]
      };
    });

    this.candlestickOptions = {
      ...this.candlestickOptions,
      series: [
        {
          name: this.symbol,
          data: candleData
        }
      ]
    };

    // Build line chart
    const labels = history.map(bar => new Date(bar.Date).toLocaleDateString());
    const closes = history.map(bar => bar.Close);

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

  onIntervalChange(newInterval: string) {
    this.currentInterval = newInterval;
    this.loadHistory();
  }

  placeOrder() {
    if (!this.commodity) {
      alert('Commodity not loaded!');
      return;
    }
    const { orderType, quantity, amount } = this.orderForm.value;

    this.orderService.placeOrder(
      this.userId,
      this.commodity.symbol,
      orderType,     // "BUY" or "SELL"
      quantity,      // optional
      amount         // optional
    ).subscribe({
      next: (res) => {
        alert(`Order Placed!\nType=${res.orderType}\nPrice=${res.price}\nTotal=${res.totalAmount}`);
        // Possibly refresh portfolio
        this.sharedService.triggerRefresh();
      },
      error: (err) => {
        console.error('Order error:', err);
        alert('Error placing order: ' + err.error?.message || err.message);
      }
    });
  }
}
