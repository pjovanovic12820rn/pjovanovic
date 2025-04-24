import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { SettledContractDto } from "../models/settled-contract-dto";

import { AuthService } from "./auth.service";
import { environment } from "../environments/environment";

import { of, throwError, timer } from "rxjs";
import { switchMap, filter, take, map } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class ContractsService {
	private apiUrl = `${environment.stockUrl}/api/otc`;

	constructor(
		private http: HttpClient,
		private authService: AuthService,
	) {}

	private getAuthHeaders(): HttpHeaders {
		const token = this.authService.getToken();
		return new HttpHeaders({
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		});
	}

	getSettledContracts(): Observable<SettledContractDto[]> {
		return this.http.get<SettledContractDto[]>(`${this.apiUrl}/options`, {
			headers: this.getAuthHeaders(),
		});
	}

	exerciseContract(
		contractId: number,
	): Observable<{ id: number; status: string }> {
		const headers = this.getAuthHeaders();

		return this.http.post<{ id: number; status: string }>(
			`${this.apiUrl}/${contractId}/exercise`,
			{},
			{ headers },
		);
	}
	pollExerciseStatus(jobId: number): Observable<string> {
		return timer(0, 2000).pipe(
			switchMap(() =>
				this.http.get<{ status: string }>(
					`${environment.stockUrl}/api/tracked-payment/${jobId}`,
					{ headers: this.getAuthHeaders() },
				),
			),
			filter((res) => res.status !== "PENDING"),
			take(1),
			map((res) => {
				if (res.status === "SUCCESS") {
					return "Contract exercised successfully.";
				} else {
					throw new Error(`Exercising contract failed. Status: ${res.status}`);
				}
			}),
		);
	}
}
