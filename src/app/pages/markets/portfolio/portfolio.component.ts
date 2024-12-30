// src/app/components/portfolio/portfolio.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Portfolio } from 'src/app/models/portfolio';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { PortfolioHistory } from 'src/app/models/portfolio-history';
import { ChartType, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    BaseChartDirective,
    RouterModule,
    NgApexchartsModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  userId = 1; // Demo user
  portfolio!: Portfolio;
  user!: User;

  chartType: ChartType = 'line';
  chartData: any = {};
  chartOptions: ChartOptions = { responsive: true };

  // Store all historical snapshots and then filter by resolution
  allSnapshots: PortfolioHistory[] = [];
  selectedResolution = 'daily'; // or 'intraday'

  private pollingSubscription!: Subscription;

  constructor(
    private portfolioService: PortfolioService,
    private userService: UserService,
    private sharedService: SharedService // Inject SharedService
  ) {}

  ngOnInit(): void {
    this.loadUserAndPortfolio();

    // Subscribe to refresh events triggered by SharedService
    this.sharedService.refreshPortfolio$.subscribe(() => {
      this.fetchPortfolioHistory(this.portfolio.id!);
    });

    // Set up polling every 5 minutes (300,000 ms)
    this.pollingSubscription = interval(300000) // 5 minutes
      .pipe(
        switchMap(() => this.portfolioService.getPortfolioHistory(this.portfolio.id!, this.selectedResolution))
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
    // Clean up the subscription when the component is destroyed
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadUserAndPortfolio(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res;
        if (res.portfolio) {
          this.portfolio = res.portfolio;
          // Fetch the history
          this.fetchPortfolioHistory(this.portfolio.id!);
        }
      },
      error: (err) => console.error(err)
    });
  }

  fetchPortfolioHistory(portfolioId: number): void {
    this.portfolioService.getPortfolioHistory(portfolioId, this.selectedResolution)
      .subscribe({
        next: (snapshots) => {
          this.allSnapshots = snapshots;
          this.buildPortfolioChart();
        },
        error: (err) => console.error(err)
      });
  }

  /**
   * Build the chart based on the selected resolution.
   */
  buildPortfolioChart() {
    if (!this.allSnapshots || this.allSnapshots.length === 0) {
      this.chartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    // Sort by dateTime ascending
    this.allSnapshots.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    const labels = this.allSnapshots.map(s => {
      const date = new Date(s.dateTime);
      return this.selectedResolution === 'daily' 
        ? date.toLocaleDateString() 
        : date.toLocaleString();
    });

    const dataPoints = this.allSnapshots.map(s => s.totalValue);

    this.chartData = {
      labels,
      datasets: [
        {
          label: `Portfolio Value (${this.selectedResolution})`,
          data: dataPoints,
          borderColor: '#00A1FF',
          backgroundColor: '#DAF1FF',
          fill: false
        }
      ]
    };
  }

  /**
   * Handle resolution toggle.
   */
  onResolutionChange(newRes: string) {
    this.selectedResolution = newRes;
    this.fetchPortfolioHistory(this.portfolio.id!);
  }

  /**
   * Update Portfolio Value and refresh the chart.
   */
  updateValue() {
    if (!this.user) return;
    this.portfolioService.updatePortfolioValue(this.user.id!).subscribe({
      next: (val) => {
        this.portfolio.totalValue = val;
        this.fetchPortfolioHistory(this.portfolio.id!);
      },
      error: (err) => console.error(err)
    });
  }
}
