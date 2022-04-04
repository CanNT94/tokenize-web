import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { createChart, ISeriesApi } from 'lightweight-charts';
import {
  candleOption,
  chartOption,
  selectorOptions,
} from '../../constant/app-constant';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { ChartService } from '../../services/chart/chart.service';

@Component({
  selector: 'tokenize-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { static: true }) chart!: ElementRef;
  selectedOption$ = new BehaviorSubject<string>(selectorOptions[0].value);
  candleSeries!: ISeriesApi<'Candlestick'>;
  destroy$ = new Subject<void>();

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    const chart = createChart(this.chart.nativeElement, {
      width: this.chart.nativeElement.offsetWidth,
      height: this.chart.nativeElement.offsetHeight,
      ...chartOption,
    });
    this.candleSeries = chart.addCandlestickSeries(candleOption);

    this.selectedOption$
      .pipe(
        switchMap((option) => {
          return this.chartService.getData({
            interval: option === 'Time' ? '1m' : option,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.candleSeries.setData(data);
      });
  }

  onSelect(value: string) {
    this.selectedOption$.next(value);
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
