import {
	Component,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	inject,
	signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { SecurityService } from "../../../services/security.service";
import { ListingDetailsDto } from "../../../models/listing-details.dto";
import { ListingType } from "../../../enums/listing-type.enum";
import { catchError, map, switchMap, tap, throwError } from "rxjs";
import {
	TimeSeriesDto,
	TimeSeriesValueDto,
} from "../../../models/time-series.model";

import zoomPlugin from "chartjs-plugin-zoom";
import { Chart, TimeScale, registerables, ChartConfiguration } from "chart.js";
import "chartjs-chart-financial";
import "chartjs-adapter-luxon";
import {
	CandlestickController,
	CandlestickElement,
} from "chartjs-chart-financial";

Chart.register(
	zoomPlugin,
	TimeScale,
	...registerables,
	CandlestickController,
	CandlestickElement,
);

@Component({
	selector: "app-stock-details",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./stock-details.component.html",
	styleUrls: ["./stock-details.component.css"],
})
export class StockDetailsComponent implements OnInit, AfterViewInit {
	private route = inject(ActivatedRoute);
	private securityService = inject(SecurityService);
	listingDetails = signal<ListingDetailsDto | null>(null);
	isLoading = signal<boolean>(true);
	errorMessage = signal<string | null>(null);
	stockId = signal<number | null>(null);
	ListingType = ListingType;

	@ViewChild("stockChart") stockChartRef!: ElementRef<HTMLCanvasElement>;
	chart!: Chart;

	ngOnInit(): void {
		this.route.paramMap
			.pipe(
				tap(() => {
					this.isLoading.set(true);
					this.errorMessage.set(null);
					this.listingDetails.set(null);
					this.stockId.set(null);
				}),
				map((params) => {
					const idParam = params.get("id");
					if (!idParam) throw new Error("Stock ID not found in route.");
					const id = parseInt(idParam, 10);
					if (isNaN(id)) throw new Error("Invalid Stock ID format.");
					this.stockId.set(id);
					return id;
				}),
				switchMap((id) =>
					this.securityService.getListingDetails(id).pipe(
						catchError((err) => {
							console.error("Fetch error:", err);
							const msg = err?.error?.message || err.message || "Load failed.";
							this.errorMessage.set(msg);
							this.isLoading.set(false);
							return throwError(() => new Error(msg));
						}),
					),
				),
			)
			.subscribe({
				next: (details) => {
					this.listingDetails.set(details);
					this.isLoading.set(false);
					setTimeout(() => {
						this.createChart(details.priceHistory);
						this.chart.resetZoom(); // ← manually call this after rendering
					});
				},
				error: (err) => {
					console.error("Subscription error:", err.message);
					this.isLoading.set(false);
				},
			});
	}

	ngAfterViewInit(): void {}

	private createChart(data: TimeSeriesValueDto[]) {
		if (!this.stockChartRef?.nativeElement) {
			console.error("Canvas not ready.");
			return;
		}

		const sorted = [...data].sort(
			(a, b) => Date.parse(a.datetime) - Date.parse(b.datetime),
		);

		const candlestickData = sorted.map((item) => ({
			x: Date.parse(item.datetime),
			o: item.open,
			h: item.high,
			l: item.low,
			c: item.close,
		}));

		const closeLineData = sorted.map((item) => ({
			x: Date.parse(item.datetime),
			y: item.close,
		}));

		const openLineData = sorted.map((item) => ({
			x: Date.parse(item.datetime),
			y: item.open,
		}));

		const highLineData = sorted.map((item) => ({
			x: Date.parse(item.datetime),
			y: item.high,
		}));

		const lowLineData = sorted.map((item) => ({
			x: Date.parse(item.datetime),
			y: item.low,
		}));
		const config: ChartConfiguration<"candlestick" | "line", any, unknown> = {
			type: "candlestick",
			data: {
				datasets: [
					{
						label: "OHLC",
						data: candlestickData,
						type: "candlestick",
					},
					{
						label: "Close Price",
						data: closeLineData,
						type: "line",
						borderColor: "blue",
						backgroundColor: "rgba(0, 0, 255, 0.05)",
						yAxisID: "y",
						tension: 0.3,
						pointRadius: 0,
						fill: false,
					},
					{
						label: "Open Price",
						data: openLineData,
						type: "line",
						borderColor: "green",
						backgroundColor: "rgba(0, 128, 0, 0.05)",
						yAxisID: "y",
						tension: 0.3,
						pointRadius: 0,
						fill: false,
					},
					{
						label: "High Price",
						data: highLineData,
						type: "line",
						borderColor: "orange",
						backgroundColor: "rgba(255, 165, 0, 0.05)",
						yAxisID: "y",
						tension: 0.3,
						pointRadius: 0,
						fill: false,
					},
					{
						label: "Low Price",
						data: lowLineData,
						type: "line",
						borderColor: "red",
						backgroundColor: "rgba(255, 0, 0, 0.05)",
						yAxisID: "y",
						tension: 0.3,
						pointRadius: 0,
						fill: false,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: "time",
						time: {
							unit: "minute",
							tooltipFormat: "yyyy-MM-dd HH:mm",
							displayFormats: { minute: "HH:mm" },
						},
						ticks: {
							autoSkip: true,
							maxRotation: 90,
							minRotation: 90,
							font: { size: 10 },
						},
						title: { display: true, text: "Time" },
					},
					y: {
						title: { display: true, text: "Price" },
					},
				},
				plugins: {
					zoom: {
						pan: { enabled: true, mode: "x" },
						zoom: {
							wheel: { enabled: true },
							pinch: { enabled: true },
							mode: "x",
						},
					},
				},
			},
		};
		const ctx = this.stockChartRef.nativeElement.getContext("2d");
		if (ctx) {
			if (this.chart) this.chart.destroy();
			this.chart = new Chart(ctx, config);
		}
	}
}
