import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "../environments/environment";

import { throwError, timer } from "rxjs";
import { switchMap, filter, take, map } from "rxjs/operators";

export interface TaxData {
	id: number;
	firstName: string;
	lastName: string;
	role: string;
	paidTaxThisYear: number;
	unpaidTaxThisMonth: number;
	totalTax: number;
}

@Injectable({
	providedIn: "root",
})
export class TaxService {
	private baseUrl = `${environment.stockUrl}/api/tax`;
	private authService = inject(AuthService);

	private getAuthHeaders(): HttpHeaders {
		const token = this.authService.getToken();
		return new HttpHeaders({
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		});
	}

	constructor(private http: HttpClient) {}

	getTaxData(
		name: string = "",
		surname: string = "",
		role: string = "",
	): Observable<TaxData[]> {
		const params = new HttpParams()
			.set("name", name)
			.set("surname", surname)
			.set("role", role);
		const headers = this.getAuthHeaders();

		return this.http.get<TaxData[]>(`${this.baseUrl}`, { headers, params });
	}

	calculateTax(): Observable<string> {
		const headers = this.getAuthHeaders();

		return this.http
			.post<{ id: number; status: string } | "">(
				`${this.baseUrl}/process`,
				{},
				{ headers },
			)
			.pipe(
				switchMap((response: { id: number; status: string } | "" | null) => {
					console.log(response);

					if (response === null || response === "") {
						return of("Nothing to process.");
					}

					if (!response?.id) {
						return throwError(
							() => new Error("Failed to start tax calculation."),
						);
					}

					return this.pollForResult(response.id);
				}),
			);
	}

	private pollForResult(jobId: number): Observable<string> {
		return timer(0, 2000).pipe(
			// Poll every 2 seconds
			switchMap(() =>
				this.http.get<{ id: number; status: string }>(
					`${environment.stockUrl}/api/tracked-payment/${jobId}`,
					{ headers: this.getAuthHeaders() },
				),
			),
			filter((res) => res.status !== "PENDING"),
			take(1),
			map((res) => {
				if (res.status === "SUCCESS") {
					return "Tax calculation completed successfully.";
				} else {
					throw new Error(`Tax calculation failed. Status: ${res.status}`);
				}
			}),
		);
	}
}
