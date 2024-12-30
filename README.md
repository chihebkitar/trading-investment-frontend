# Modernize-Angular-pro
Modernize Angular Admin Dashboard
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Portfolio, PortfolioPosition } from 'src/app/services/portfolio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-earning-reports',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  template: 
<mat-card class="cardWithShadow">
  <mat-card-content>
    <div class="d-flex justify-content-between align-items-center m-b-16">
      <mat-card-title class="m-b-0 f-s-18">My Holdings</mat-card-title>
    </div>

    <ul class="list-unstyled m-0">
      <ng-container *ngIf="portfolio && portfolio.holdings">
        <ng-container *ngFor="let holding of convertHoldingsToArray(portfolio.holdings)">
          <li class="d-flex align-items-center justify-content-between p-y-18 b-b-1">
            <div class="d-flex align-items-center">
              <span
                class="bg-light-primary text-primary rounded-circle-shape p-x-16 p-y-8 m-r-16 rounded-pill d-flex align-items-center justify-content-center">
                <i class="iconify f-s-24" data-icon="solar:star-line-duotone"></i>
              </span>
              <div>
                <!-- holding.key e.g. "EUR" or "AAPL" -->
                <h6 class="mat-subtitle-1 f-s-14 lh-sm">{{ holding.key }}</h6>
                <p class="mat-body-1 f-s-12 f-w-500 d-flex align-items-center gap-4">
                  Qty: {{ holding.value.quantity | number:'1.2-2' }}
                  <i class="iconify" data-icon="solar:info-circle-linear"></i>
                </p>
              </div>
            </div>
            <span class="bg-light-success text-success f-s-12 f-w-500 p-x-10 p-y-4 rounded-pill">
              Invested: {{ holding.value.totalInvested | currency }}
            </span>
          </li>
        </ng-container>
      </ng-container>
    </ul>
  </mat-card-content>
</mat-card>
,
})
export class AppEarningReportsComponent {
  @Input() portfolio: Portfolio | null = null;

  constructor() {}

  // holdingsObj: Record<string, PortfolioPosition>
  // So each .entry is [key:string, val:PortfolioPosition]
  convertHoldingsToArray(holdingsObj: Record<string, PortfolioPosition> = {}): Array<{
    key: string;
    value: PortfolioPosition;
  }> {
    return Object.entries(holdingsObj).map(([k, v]) => ({ key: k, value: v }));
  }
}
<mat-card class="cardWithShadow">
    <mat-card-content>
        <div class="d-flex justify-content-between align-items-center m-b-16">
            <mat-card-title class="m-b-0 f-s-18">Earning Reports</mat-card-title>
            <div>
                <button class="custom-mdc-button" mat-button [matMenuTriggerFor]="menu">
                    <i-tabler name="dots-vertical" class="icon-20"></i-tabler>
                </button>
                <mat-menu #menu="matMenu" xPosition="before">
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Action</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Another action</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Something else here</span>
                    </a>
                </mat-menu>
            </div>
        </div>

        @for(stat of stats; track stat.color) {
        <ul class="list-unstyled m-0">
            <li class="d-flex align-items-center justify-content-between p-y-18 b-b-1">
                <div class="d-flex align-items-center">
                    <span
                        class="text-{{ stat.color }} bg-light-{{ stat.color }} rounded-circle-shape p-x-16 p-y-8 m-r-16 rounded-pill d-flex align-items-center justify-content-center">
                        <i class="iconify f-s-24" [attr.data-icon]="stat.icon"></i>
                    </span>
                    <div>
                        <h6 class="mat-subtitle-1 f-s-14 lh-sm">{{ stat.title }}</h6>
                        <p class="mat-body-1 f-s-12 f-w-500 d-flex align-items-center gap-4">
                            {{ stat.subtitle }}
                            <i class="iconify" data-icon="solar:info-circle-linear"></i>
                        </p>
                    </div>
                </div>
                <span
                    class="bg-light-success text-success f-s-12 f-w-500 p-x-10 p-y-4 rounded-pill d-flex align-content-center gap-4">
                    <i class="iconify f-s-12" data-icon="solar:alt-arrow-up-bold"></i>
                    {{ stat.badge }}
                </span>
            </li>
        </ul>
        }
        <a href="javascript:void(0)"
            class="f-s-16 f-w-500 hover-text m-t-18 text-center d-block text-decoration-none text-dark">View
            more markets</a>
    </mat-card-content>
</mat-card>
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OrdersService, TradeOrder } from 'src/app/services/orders.service';

@Component({
  selector: 'app-popular-products',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, MatProgressBarModule],
  template: 
<mat-card class="cardWithShadow overflow-hidden">
  <mat-card-content>
    <mat-card-title class="m-b-4">My Orders</mat-card-title>
    <mat-card-subtitle class="mat-mdc-card-subtitle">History of Orders</mat-card-subtitle>
  </mat-card-content>
  <div class="table-responsive">
    <table mat-table [dataSource]="orders" class="w-100">
      <!-- Order ID -->
      <ng-container matColumnDef="orderId">
        <th mat-header-cell *matHeaderCellDef>Order ID</th>
        <td mat-cell *matCellDef="let o">{{o.id}}</td>
      </ng-container>

      <!-- Side -->
      <ng-container matColumnDef="side">
        <th mat-header-cell *matHeaderCellDef>Side</th>
        <td mat-cell *matCellDef="let o">{{o.side}}</td>
      </ng-container>

      <!-- Type -->
      <ng-container matColumnDef="orderType">
        <th mat-header-cell *matHeaderCellDef>Type</th>
        <td mat-cell *matCellDef="let o">{{o.orderType}}</td>
      </ng-container>

      <!-- Amount -->
      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef>Amount</th>
        <td mat-cell *matCellDef="let o">{{o.amount | currency}}</td>
      </ng-container>

      <!-- Price -->
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let o">
          <span *ngIf="o.price != null">{{o.price | currency}}</span>
          <span *ngIf="o.price == null">Market</span>
        </td>
      </ng-container>

      <!-- Status -->
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let o">
          <span class="bg-light-accent text-accent f-s-12 f-w-500 p-x-10 p-y-4 rounded-pill">
            {{o.status}}
          </span>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </div>
</mat-card>
,
})
export class AppPopularProductsComponent {
  @Input() orders: TradeOrder[] = [];

  displayedColumns: string[] = ['orderId','side','orderType','amount','price','status'];

  constructor() {}
}
<mat-card class="cardWithShadow overflow-hidden">
<mat-card-content>
    <mat-card-title class="m-b-4">Popular Products</mat-card-title>
    <mat-card-subtitle class="mat-mdc-card-subtitle">Total 9k Visitors</mat-card-subtitle>
</mat-card-content>
<div class="table-responsive">
    <table mat-table [dataSource]="dataSource" class="w-100">
        <!-- Profile Column -->
        <ng-container matColumnDef="products">
            <th mat-header-cell *matHeaderCellDef class="mat-subtitle-1 f-s-14">
                Products
            </th>
            <td mat-cell *matCellDef="let element">
                <div class="d-flex align-items-center">
                    <img [src]="element.imagePath" alt="users" width="60" class="rounded-7" />
                    <div class="m-l-16 product-title">
                        <h6 class="mat-subtitle-1 text-truncate-2 f-s-14 lh-sm">
                            {{ element.uname }}
                        </h6>
                    </div>
                </div>
            </td>
        </ng-container>

        <!-- Hour Rate Column -->
        <ng-container matColumnDef="payment">
            <th mat-header-cell *matHeaderCellDef class="mat-subtitle-1 f-s-14">
                Payment
            </th>
            <td mat-cell *matCellDef="let element">
                <h6 class="mat-subtitle-1 f-s-16">{{ element.price }} <span class="text-muted">/499</span></h6>
                <p class="text-muted m-b-8 f-s-14 m-t-0">{{ element.paid }}</p>
                <mat-progress-bar mode="determinate" color="{{ element.progress }}" value="40"></mat-progress-bar>
            </td>
        </ng-container>

        <!-- Symbol Column -->
        <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="mat-subtitle-1 f-s-14">
                Status
            </th>
            <td mat-cell *matCellDef="let element">
                <span class="bg-light-{{ element.progress }} text-{{
                  element.progress
                }} f-s-12 f-w-500 p-x-10 p-y-4 rounded-pill">
                    {{ element.status | titlecase }}
                </span>
            </td>
        </ng-container>

        <!-- Weight Column -->
        <ng-container matColumnDef="menu">
            <th mat-header-cell *matHeaderCellDef class="mat-subtitle-1 f-s-14">

            </th>
            <td mat-cell *matCellDef="let element">
                <button mat-icon-button [matMenuTriggerFor]="menu"
                    aria-label="Example icon button with a vertical three dot icon">
                    <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu" xPosition="before">
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <i-tabler name="plus" class="icon-18"></i-tabler>
                        <span>Add</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <i-tabler name="edit" class="icon-18"></i-tabler>
                        <span>Edit</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <i-tabler name="trash" class="icon-18"></i-tabler>
                        <span>Delete</span>
                    </a>
                </mat-menu>
            </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
</div>
</mat-card>
<mat-card class="shadow-none bg-light-accent">
    <mat-card-content>
        <div class="d-flex justify-content-between align-items-center m-b-20 p-b-2">
            <div class="d-flex align-items-center gap-12">
                <div
                    class="bg-accent rounded-circle-shape p-x-16 p-y-8 rounded-pill d-flex align-items-center justify-content-center">
                    <i class="iconify f-s-24 text-white" data-icon="solar:wallet-2-line-duotone"></i>
                </div>
                <mat-card-title class="m-b-0 f-s-16 f-w-500 text-muted">Total Income</mat-card-title>
            </div>
            <div>
                <button class="custom-mdc-button" mat-button [matMenuTriggerFor]="menu">
                    <i-tabler name="dots-vertical" class="icon-20"></i-tabler>
                </button>
                <mat-menu #menu="matMenu" xPosition="before">
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Action</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Another action</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Something else here</span>
                    </a>
                </mat-menu>
            </div>
        </div>
        <div class="row align-items-center justify-content-between p-t-24">
            <div class="col-6">
                <h2 class="mat-subtitle-1 f-s-30 lh-lg m-b-12">$6,280</h2>
                <span class="f-s-12 f-w-600 p-x-10 p-y-4 rounded-pill border-muted text-muted">+18% last month</span>
            </div>
            <div class="col-5">
                <apx-chart [series]="totalincomeChart.series" [chart]="totalincomeChart.chart"
                    [stroke]="totalincomeChart.stroke" [fill]="totalincomeChart.fill"
                    [markers]="totalincomeChart.markers" [tooltip]="totalincomeChart.tooltip"></apx-chart>
            </div>
        </div>
    </mat-card-content>
</mat-card>
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-income',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule, CommonModule],
  template: 
<mat-card class="shadow-none bg-light-accent">
  <mat-card-content>
    <div class="d-flex justify-content-between align-items-center m-b-20 p-b-2">
      <div class="d-flex align-items-center gap-12">
        <div class="bg-accent rounded-circle-shape p-x-16 p-y-8 rounded-pill d-flex align-items-center justify-content-center">
          <i class="iconify f-s-24 text-white" data-icon="solar:wallet-2-line-duotone"></i>
        </div>
        <mat-card-title class="m-b-0 f-s-16 f-w-500 text-muted">Total Invested</mat-card-title>
      </div>
    </div>
    <div class="row align-items-center justify-content-between p-t-24">
      <div class="col-12">
        <h2 class="mat-subtitle-1 f-s-30 lh-lg m-b-12">
          {{ totalInvested | currency }}
        </h2>
        <!-- Just hide the old chart or keep it if you want a mini-sparkline. 
             We'll keep the card style for a consistent look. -->
      </div>
    </div>
  </mat-card-content>
</mat-card>
,
})
export class AppTotalIncomeComponent {
  @Input() totalInvested: number = 0;
  constructor() {}
}
import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-followers',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule, CommonModule],
  template: 
<mat-card class="shadow-none bg-light-error">
  <mat-card-content>
    <div class="d-flex justify-content-between align-items-center m-b-20 p-b-2">
      <div class="d-flex align-items-center gap-12">
        <div
          class="bg-error rounded-circle-shape p-x-16 p-y-8 rounded-pill d-flex align-items-center justify-content-center">
          <i class="iconify f-s-24 text-white" data-icon="solar:users-group-rounded-bold-duotone"></i>
        </div>
        <mat-card-title class="m-b-0 f-s-16 f-w-500 text-muted">Total Profit/Loss</mat-card-title>
      </div>
    </div>
    <div class="row align-items-end justify-content-between">
      <div class="col-12">
        <h2 class="mat-subtitle-1 f-s-30 lh-lg m-b-12">
          {{ profitOrLoss | currency }}
        </h2>
        <!-- If you want a % growth, you can compute it. e.g. 
             [profitOrLoss / totalInvested * 100], or store it in a variable. -->
      </div>
    </div>
  </mat-card-content>
</mat-card>
,
})
export class AppTotalFollowersComponent {
  @Input() profitOrLoss: number = 0;
  constructor() {}
}
<mat-card class="shadow-none bg-light-error">
    <mat-card-content>
        <div class="d-flex justify-content-between align-items-center m-b-20 p-b-2">
            <div class="d-flex align-items-center gap-12">
                <div
                    class="bg-error rounded-circle-shape p-x-16 p-y-8 rounded-pill d-flex align-items-center justify-content-center">
                    <i class="iconify f-s-24 text-white" data-icon="solar:users-group-rounded-bold-duotone"></i>
                </div>
                <mat-card-title class="m-b-0 f-s-16 f-w-500 text-muted">Total followers</mat-card-title>
            </div>
            <div>
                <button class="custom-mdc-button" mat-button [matMenuTriggerFor]="menu">
                    <i-tabler name="dots-vertical" class="icon-20"></i-tabler>
                </button>
                <mat-menu #menu="matMenu" xPosition="before">
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Action</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Another action</span>
                    </a>
                    <a href="javascript:void(0)"
                        class="d-flex align-items-center text-decoration-none p-y-10 p-x-16 mat-body-1 gap-8">
                        <span>Something else here</span>
                    </a>
                </mat-menu>
            </div>
        </div>
        <div class="row align-items-end justify-content-between">
            <div class="col-6">
                <h2 class="mat-subtitle-1 f-s-30 lh-lg m-b-12">4,562</h2>
                <span class="f-s-12 f-w-600 p-x-10 p-y-4 rounded-pill border-muted text-muted">+23% last month</span>
            </div>
            <div class="col-5">
                <apx-chart [series]="totalfollowersChart.series" [chart]="totalfollowersChart.chart"
                    [colors]="totalfollowersChart.colors" [dataLabels]="totalfollowersChart.dataLabels"
                    [legend]="totalfollowersChart.legend" [tooltip]="totalfollowersChart.tooltip"
                    [plotOptions]="totalfollowersChart.plotOptions" [grid]="totalfollowersChart.grid"
                    [xaxis]="totalfollowersChart.xaxis" [yaxis]="totalfollowersChart.yaxis"
                    class="rounded-bars"></apx-chart>
            </div>
        </div>
    </mat-card-content>
</mat-card>
<mat-card class="cardWithShadow">
    <mat-card-content>
        <div class="hstack align-items-center flex-column flex-lg-row m-b-20">
            <mat-card-title>Sales Profit</mat-card-title>
            <div class="m-l-auto">
                <mat-form-field class="theme-select" appearance="outline">
                    <mat-select value="mar">
                        @for(month of months; track month.viewValue ) {
                        <mat-option [value]="month.value">
                            {{ month.viewValue }}
                        </mat-option>
                        }
                    </mat-select>
                </mat-form-field>
            </div>
        </div>

        <apx-chart [series]="salesprofitChart.series" [dataLabels]="salesprofitChart.dataLabels"
            [chart]="salesprofitChart.chart" [legend]="salesprofitChart.legend" [colors]="salesprofitChart.colors"
            [grid]="salesprofitChart.grid" [fill]="salesprofitChart.fill" [stroke]="salesprofitChart.stroke"
            [tooltip]="salesprofitChart.tooltip" [markers]="salesprofitChart.markers" [xaxis]="salesprofitChart.xaxis"
            [responsive]="salesprofitChart.responsive" [yaxis]="salesprofitChart.yaxis">
        </apx-chart>

    </mat-card-content>
</mat-card>

import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  NgApexchartsModule,
  ApexPlotOptions,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
} from 'ng-apexcharts';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

export interface ChartXY { x: string; y: number; }

@Component({
  selector: 'app-sales-profit',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule,NgApexchartsModule, CommonModule],
  template: 
<mat-card class="cardWithShadow">
  <mat-card-content>
    <div class="hstack align-items-center flex-column flex-lg-row m-b-20">
      <mat-card-title>Sales Profit</mat-card-title>
    </div>
    <apx-chart 
      [series]="chartSeries"
      [chart]="chartOptions.chart"
      [colors]="chartOptions.colors"
      [dataLabels]="chartOptions.dataLabels"
      [fill]="chartOptions.fill"
      [grid]="chartOptions.grid"
      [stroke]="chartOptions.stroke"
      [tooltip]="chartOptions.tooltip"
      [markers]="chartOptions.markers"
      [xaxis]="chartOptions.xaxis"
      [yaxis]="chartOptions.yaxis"
    >
    </apx-chart>
  </mat-card-content>
</mat-card>
,
})
export class AppSalesProfitComponent implements OnChanges {
  @ViewChild('chart') chart?: ChartComponent;

  // The new inputs
  @Input() moneyInvestedData: ChartXY[] = [];
  @Input() portfolioValueData: ChartXY[] = [];

  chartSeries: ApexAxisChartSeries = [];
  chartOptions: any = {};

  constructor() {
    this.setupChartDefaults();
  }

  ngOnChanges(): void {
    this.refreshChartSeries();
  }

  private setupChartDefaults() {
    // Basic chart config, you can keep from original
    this.chartOptions = {
      chart: {
        type: 'area',
        height: 320,
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        toolbar: { show: false },
      },
      colors: ['#00A1FF', '#8965E5'],
      dataLabels: { enabled: false },
      fill: { type: 'solid', opacity: 0.1 },
      grid: { show: true, strokeDashArray: 3, borderColor: '#90A4AE50' },
      stroke: { curve: 'smooth', width: 2 },
      tooltip: { theme: 'dark' },
      markers: { size: 0 },
      xaxis: { labels: { show: true }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { tickAmount: 3 },
    };
  }

  private refreshChartSeries() {
    // We make 2 series
    this.chartSeries = [
      {
        name: 'Money Invested',
        type: 'area',
        data: this.moneyInvestedData,
      },
      {
        name: 'Portfolio Value',
        type: 'line',
        data: this.portfolioValueData,
      },
    ];
  }
}
<div class="row" *ngIf="!loading">
  <div class="col-lg-8">
    <!-- SalesProfit: pass the series data for chart. -->
    <app-sales-profit
      [moneyInvestedData]="moneyInvestedOverTime"
      [portfolioValueData]="portfolioValueOverTime"
    ></app-sales-profit>
  </div>

  <div class="col-lg-4">
    <div class="row">
      <div class="col-12">
        <!-- TotalFollowers becomes "TotalProfit" in code. We'll just pass the number. -->
        <app-total-followers
          [profitOrLoss]="totalProfitOrLoss"
        ></app-total-followers>
      </div>
      <div class="col-12">
        <!-- Total Income: show how much money we invested in total. -->
        <app-total-income
          [totalInvested]="totalInvested"
        ></app-total-income>
      </div>
    </div>
  </div>

  <div class="col-lg-8">
    <!-- PopularProducts now shows the user's orders. -->
    <app-popular-products
      [orders]="orders"
    ></app-popular-products>
  </div>

  <div class="col-lg-4">
    <!-- EarningReports: show the holdings from the portfolio. -->
    <app-earning-reports
      [portfolio]="portfolio"
    ></app-earning-reports>
  </div>

  <div class="col-12">
    <app-blog-card></app-blog-card>
  </div>
</div>
<div *ngIf="loading" style="text-align:center;padding:20px;">
  <mat-progress-spinner diameter="50"></mat-progress-spinner>
</div>
<div class="row" *ngIf="!loading">
  <div class="col-lg-8">
    <!-- SalesProfit: pass the series data for chart. -->
    <app-sales-profit
      [moneyInvestedData]="moneyInvestedOverTime"
      [portfolioValueData]="portfolioValueOverTime"
    ></app-sales-profit>
  </div>

  <div class="col-lg-4">
    <div class="row">
      <div class="col-12">
        <!-- TotalFollowers becomes "TotalProfit" in code. We'll just pass the number. -->
        <app-total-followers
          [profitOrLoss]="totalProfitOrLoss"
        ></app-total-followers>
      </div>
      <div class="col-12">
        <!-- Total Income: show how much money we invested in total. -->
        <app-total-income
          [totalInvested]="totalInvested"
        ></app-total-income>
      </div>
    </div>
  </div>

  <div class="col-lg-8">
    <!-- PopularProducts now shows the user's orders. -->
    <app-popular-products
      [orders]="orders"
    ></app-popular-products>
  </div>

  <div class="col-lg-4">
    <!-- EarningReports: show the holdings from the portfolio. -->
    <app-earning-reports
      [portfolio]="portfolio"
    ></app-earning-reports>
  </div>

  <div class="col-12">
    <app-blog-card></app-blog-card>
  </div>
</div>
<div *ngIf="loading" style="text-align:center;padding:20px;">
  <mat-progress-spinner diameter="50"></mat-progress-spinner>
</div>
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssetDTO {
  id: number;
  symbol: string;
  name: string;
  type: string;
  currentPrice?: number;
}
export interface PortfolioPosition {
  quantity: number;
  totalInvested: number;
}

export interface Portfolio {
  id: number;
  userId: number;
  // Now each key is the asset symbol, each value is the PortfolioPosition object:
  holdings: Record<string, PortfolioPosition>;
  totalValue?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl = 'http://localhost:8080/api/portfolios';

  constructor(private http: HttpClient) {}

  getPortfolioByUserId(userId: number): Observable<Portfolio> {
    return this.http.get<Portfolio>(${this.baseUrl}/user/${userId});
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TradeOrder {
  id: number;
  userId: number;
  assetId: number;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  // No longer a "quantity" field
  amount: number;     // new field
  price?: number;
  status?: string;
  timestamp?: string;
}


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: Partial<TradeOrder>): Observable<TradeOrder> {
    return this.http.post<TradeOrder>(this.baseUrl, order);
  }

  getOrdersByUserId(userId: number): Observable<TradeOrder[]> {
    return this.http.get<TradeOrder[]>(${this.baseUrl}/user/${userId});
  }

  getOrderById(orderId: number): Observable<TradeOrder> {
    return this.http.get<TradeOrder>(${this.baseUrl}/${orderId});
  }

  cancelOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(${this.baseUrl}/${orderId});
  }
}
ChatGPT

Thought about portfolio updates and UI adjustments pendant 7 secondes
Below is one possible approach to fix all the issues you mentioned—particularly around:

Chart amounts being incorrect.
Chart timeframes adjusting automatically based on how recent the investments are.
Total Invested & Total Profit/Loss styling.
My Holdings displaying more neatly (not raw JSON).
amount in Orders table being blank.
There are many ways to do this; consider thi