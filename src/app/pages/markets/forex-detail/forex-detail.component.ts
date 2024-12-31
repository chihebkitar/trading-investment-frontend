// src/app/components/forex-detail/forex-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Forex } from 'src/app/models/forex.model';
import { ForexService } from 'src/app/services/forex.service';
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
  selector: 'app-forex-detail',
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
  templateUrl: './forex-detail.component.html',
  styleUrls: ['./forex-detail.component.scss']
})
export class ForexDetailComponent implements OnInit {
  forex: Forex | null = null;
  symbol: string = '';

  // Chart
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
  userId = 1; // or from auth
  orderForm!: FormGroup;
  
  private historyData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private forexService: ForexService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol') || '';
    this.loadForex();

    // Build order form
    this.orderForm = this.fb.group({
      orderType: ['BUY', Validators.required],
      quantity: [0],
      amount: [0]
    });
  }

  loadForex(): void {
    this.forexService.getForex(this.symbol).subscribe({
      next: (res) => {
        this.forex = res;
        this.loadHistory();
      },
      error: (err) => console.error('Error loading forex:', err)
    });
  }

  loadHistory() {
    this.forexService.getForexHistory(this.symbol, this.currentInterval)
      .subscribe({
        next: (res) => {
          this.historyData = res.history || [];
          this.buildCharts(this.historyData);
        },
        error: (err) => console.error('Error loading history:', err)
      });
  }

  buildCharts(history: any[]) {
    if (!history || history.length < 1) {
      // Clear charts
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

    // Candlestick data
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

    // line chart from close
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

  placeOrder() {
    if (!this.forex) {
      alert('No forex loaded!');
      return;
    }
    const { orderType, quantity, amount } = this.orderForm.value;

    // The user is effectively trading by USD. Our backend logic 
    // is the same as with stocks, but remember you're buying or selling a currency pair.
    // e.g., "EURUSD=X" means 1 EUR costs X USD. 
    // So quantity means how many units of the base currency you're buying/selling.

    this.orderService.placeOrder(
      this.userId,
      this.forex.symbol,   // e.g. "EURUSD=X"
      orderType,           
      quantity,            
      amount               
    ).subscribe({
      next: (res) => {
        alert(`Order Placed!\nType=${res.orderType}\nPrice=${res.price}\nTotal=${res.totalAmount}`);
        this.sharedService.triggerRefresh();
      },
      error: (err) => {
        console.error('Order error:', err);
        alert('Error placing order: ' + err.error?.message || err.message);
      }
    });
  }
}
