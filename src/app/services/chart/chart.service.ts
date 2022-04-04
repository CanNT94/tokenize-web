import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private api = 'https://api.binance.com/api/';

  constructor(private http: HttpClient) {}

  getData({ interval = '1m' }) {
    return this.http
      .get<Array<Array<string | number>>>(this.api + 'v3/klines', {
        params: {
          limit: 2000,
          symbol: 'BTCUSDT',
          interval,
        },
      })
      .pipe(
        map((data) =>
          data.map(([time, open, high, low, close]) => ({
            time: time as string,
            open: Number(open),
            close: Number(close),
            high: Number(high),
            low: Number(low),
          }))
        )
      );
  }
}
