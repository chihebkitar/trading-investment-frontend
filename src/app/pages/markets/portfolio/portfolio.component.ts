// portfolio.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions as Ng2ChartOptions } from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';

import { Portfolio } from 'src/app/models/portfolio';
import { User } from 'src/app/models/user';
import { PortfolioHistory } from 'src/app/models/portfolio-history';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    BaseChartDirective,
    NgApexchartsModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  // Demo user
  userId = 1;
  user!: User;
  portfolio!: Portfolio;

  // Toggle between ng2-charts and ApexCharts
  useApexChart = false;

  // ng2-charts configs
  chartType: ChartType = 'line';
  chartData: any = {};
  chartOptions: Ng2ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  // ApexCharts config
  apexChartOptions: ApexOptions = {
    chart: { type: 'line', height: 350 },
    title: { text: 'Portfolio Value Over Time', align: 'left' },
    xaxis: { type: 'datetime' },
    yaxis: { 
      tooltip: { enabled: true }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#00A1FF', '#FF5733'],
    tooltip: {
      enabled: true,
      shared: true,
      x: {
        format: 'dd MMM yyyy HH:mm'
      }
    },
    series: []
  };

  // Historical snapshots
  allSnapshots: PortfolioHistory[] = [];
  selectedResolution = 'daily'; // or 'intraday'

  // Performance Indicators
  roi = 0;               // Return on Investment
  cagr: number | null = null; // Compound Annual Growth Rate
  sharpeRatio = 0;       // Sharpe Ratio

  private pollingSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private portfolioService: PortfolioService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // 1) Fetch User
    this.userService.getUserById(this.userId).subscribe({
      next: (usr) => {
        this.user = usr;

        // 2) Then fetch Portfolio for that user
        this.portfolioService.getPortfolioByUser(this.userId).subscribe({
          next: (port) => {
            this.portfolio = port;
            console.log('Portfolio:', this.portfolio);

            // Fetch historical snapshots
            this.fetchPortfolioHistory(this.portfolio.id!);
          },
          error: (err) => console.error('Error fetching portfolio:', err)
        });
      },
      error: (err) => console.error('Error fetching user:', err)
    });

    // Listen for refresh events triggered by e.g. placing an order
    this.sharedService.refreshPortfolio$.subscribe(() => {
      if (this.portfolio?.id) {
        this.fetchPortfolioHistory(this.portfolio.id);
      }
    });

    // Optional: Poll the portfolio history every 5 minutes
    this.pollingSubscription = interval(300000) // 5 minutes
      .pipe(
        switchMap(() =>
          this.portfolioService.getPortfolioHistory(
            this.portfolio?.id!,
            this.selectedResolution
          )
        )
      )
      .subscribe({
        next: (snapshots) => {
          this.allSnapshots = snapshots;
          this.buildPortfolioChart();
        },
        error: (err) => console.error('Polling error:', err)
      });
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  /**
   * Fetch the history snapshots for charting
   */
  fetchPortfolioHistory(portfolioId: number): void {
    this.portfolioService.getPortfolioHistory(portfolioId, this.selectedResolution)
      .subscribe({
        next: (snapshots) => {
          this.allSnapshots = snapshots;
          this.buildPortfolioChart();
        },
        error: (err) => console.error('Error fetching history:', err)
      });
  }

  /**
   * Build both ng2-charts and ApexCharts data
   */
  buildPortfolioChart(): void {
    if (!this.allSnapshots || this.allSnapshots.length === 0) {
      // Clear out if no data
      this.chartData = { labels: [], datasets: [] };
      this.apexChartOptions = {
        ...this.apexChartOptions,
        series: []
      };
      return;
    }

    // Sort snapshots by date ascending
    this.allSnapshots.sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

    // X-axis labels
    const labels = this.allSnapshots.map((snap) => {
      const dt = new Date(snap.dateTime);
      return this.selectedResolution === 'daily'
        ? dt.toLocaleDateString()
        : dt.toLocaleString();
    });

    // Portfolio Value and Invested Amount
    const portfolioValues = this.allSnapshots.map((snap) => snap.totalValue);
    const investedAmounts = this.allSnapshots.map((snap) =>
      this.calculateInvestedAmount(snap.portfolio.positions)
    );

    // Calculate performance indicators
    this.calculateROI(investedAmounts, portfolioValues);
    this.calculateCAGR();
    this.calculateSharpeRatio();

    // -- 1) Build data for ng2-charts
    this.chartData = {
      labels,
      datasets: [
        {
          label: `Portfolio Value (${this.selectedResolution})`,
          data: portfolioValues,
          borderColor: '#00A1FF',
          backgroundColor: '#DAF1FF',
          fill: false
        },
        {
          label: `Invested Amount`,
          data: investedAmounts,
          borderColor: '#FF5733',
          backgroundColor: '#FFC300',
          fill: false
        }
      ]
    };

    // -- 2) Build data for ApexCharts
    // We supply an array of {x, y} for each series
    const apexPortfolioSeries = this.allSnapshots.map((snap) => ({
      x: new Date(snap.dateTime).getTime(),
      y: snap.totalValue
    }));
    const apexInvestedSeries = this.allSnapshots.map((snap) => ({
      x: new Date(snap.dateTime).getTime(),
      y: this.calculateInvestedAmount(snap.portfolio.positions)
    }));

    this.apexChartOptions = {
      ...this.apexChartOptions,
      series: [
        {
          name: `Portfolio Value (${this.selectedResolution})`,
          data: apexPortfolioSeries
        },
        {
          name: 'Invested Amount',
          data: apexInvestedSeries
        }
      ]
    };
  }

  /**
   * Calculate total invested amount from positions
   */
  calculateInvestedAmount(positions: any[]): number {
    return positions.reduce((total, pos) => {
      return total + pos.averageCost * pos.quantity;
    }, 0);
  }

  /**
   * Calculate Return on Investment (ROI)
   */
  calculateROI(investedAmounts: number[], portfolioValues: number[]): void {
    const latestInvested = investedAmounts[investedAmounts.length - 1];
    const latestPortfolio = portfolioValues[portfolioValues.length - 1];
    if (latestInvested === 0) {
      this.roi = 0;
      return;
    }
    this.roi = ((latestPortfolio - latestInvested) / latestInvested) * 100;
  }

  /**
   * Calculate Compound Annual Growth Rate (CAGR)
   */
  calculateCAGR(): void {
    if (this.allSnapshots.length < 2) {
      this.cagr = null;
      return;
    }
    const firstSnapshot = this.allSnapshots[0];
    const lastSnapshot = this.allSnapshots[this.allSnapshots.length - 1];
    const startDate = new Date(firstSnapshot.dateTime).getTime();
    const endDate = new Date(lastSnapshot.dateTime).getTime();

    const durationMs = endDate - startDate;
    if (durationMs <= 0) {
      this.cagr = null;
      return;
    }

    const years = durationMs / (1000 * 60 * 60 * 24 * 365.25);
    if (years < 1) {
      this.cagr = null; // Not enough time for CAGR
      return;
    }

    const initialValue = firstSnapshot.totalValue;
    const finalValue = lastSnapshot.totalValue;
    if (initialValue <= 0) {
      this.cagr = null;
      return;
    }

    this.cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  }

  /**
   * Calculate Sharpe Ratio
   * Using a fixed 2% risk-free rate
   */
  calculateSharpeRatio(): void {
    const riskFreeRate = 2; // 2%
    const returns = this.calculatePeriodicReturns();
    if (returns.length === 0) {
      this.sharpeRatio = 0;
      return;
    }

    const averageReturn = this.calculateAverage(returns);
    const volatility = this.calculateStandardDeviation(returns);
    if (volatility === 0) {
      this.sharpeRatio = 0;
      return;
    }

    // Annualization factor
    let annualFactor = 1;
    if (this.selectedResolution === 'daily') {
      annualFactor = 252; // trading days in a year
    } else if (this.selectedResolution === 'intraday') {
      annualFactor = 252 * 6.5; // approximate trading hours
    }

    const annualizedReturn = averageReturn * annualFactor;
    const annualizedVolatility = volatility * Math.sqrt(annualFactor);

    this.sharpeRatio = (annualizedReturn - riskFreeRate) / annualizedVolatility;
  }

  /**
   * Calculate returns array
   */
  calculatePeriodicReturns(): number[] {
    const returns: number[] = [];
    for (let i = 1; i < this.allSnapshots.length; i++) {
      const prev = this.allSnapshots[i - 1].totalValue;
      const current = this.allSnapshots[i].totalValue;
      if (prev === 0) {
        returns.push(0);
        continue;
      }
      const ret = ((current - prev) / prev) * 100;
      returns.push(ret);
    }
    return returns;
  }

  calculateAverage(data: number[]): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  calculateStandardDeviation(data: number[]): number {
    if (data.length === 0) return 0;
    const avg = this.calculateAverage(data);
    const squareDiffs = data.map(val => Math.pow(val - avg, 2));
    const avgSquareDiff = this.calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Switch resolution
   */
  onResolutionChange(newRes: string) {
    this.selectedResolution = newRes;
    if (this.portfolio?.id) {
      this.fetchPortfolioHistory(this.portfolio.id);
    }
  }

  /**
   * Update portfolio value from back end
   */
  updateValue() {
    if (!this.user?.id) return;
    this.portfolioService.updatePortfolioValue(this.user.id).subscribe({
      next: (val) => {
        this.portfolio.totalValue = val;
        if (this.portfolio.id) {
          this.fetchPortfolioHistory(this.portfolio.id);
        }
      },
      error: (err) => console.error('Error updating portfolio value:', err)
    });
  }
}
