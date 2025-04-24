import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { routes } from "./app-routing.module";
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart } from 'chart.js';
import 'chartjs-chart-financial';
import 'chartjs-adapter-luxon';

export const appConfig: ApplicationConfig = {
  providers: [
    [provideCharts(withDefaultRegisterables())],
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ]
}
