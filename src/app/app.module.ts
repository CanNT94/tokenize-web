import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChartComponent } from './components/chart/chart.component';
import { SelectorIntervalComponent } from './components/selector-interval/selector-interval.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MenuComponent } from './components/selector-interval/menu/menu.component';

@NgModule({
  declarations: [AppComponent, ChartComponent, SelectorIntervalComponent, MenuComponent],
  imports: [BrowserModule, CommonModule, HttpClientModule, OverlayModule, MatIconModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
