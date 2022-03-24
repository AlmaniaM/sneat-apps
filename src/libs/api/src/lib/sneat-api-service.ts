import { ISneatApiService } from './sneat-api-service.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, Subject, takeUntil, throwError } from 'rxjs';
import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const userIsNotAuthenticatedNoFirebaseToken =
	'User is not authenticated yet - no Firebase ID token';

export const SneatApiAuthTokenProvider = new InjectionToken('SneatApiAuthTokenProvider');
export const SneatApiBaseUrl = new InjectionToken('SneatApiBaseUrl');
export const DefaultSneatApiBaseUrl = 'https://api.sneat.team/v0/';

@Injectable({ providedIn: 'root' }) // Should it be in root? Maybe not
export class SneatApiService implements ISneatApiService, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private authToken?: string;

	constructor(
		private readonly httpClient: HttpClient,
		afAuth: AngularFireAuth, // TODO: Get rid of hard dependency on AngularFireAuth and instead have some token provider
		@Inject(SneatApiBaseUrl) private readonly baseUrl?: string,
		// @Inject(SneatApiAuthTokenProvider) private authTokenProvider: Observable<string | undefined>,
	) {
		console.log('SneatApiService.constructor()', baseUrl);
		if (!baseUrl) {
			this.baseUrl = DefaultSneatApiBaseUrl;
		}
		afAuth.idToken
			.pipe(
				takeUntil(this.destroyed),
				map(token => token || undefined),
			)
			.subscribe({
				next: this.setApiAuthToken,
			});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	// TODO: It's made public because we use it in Login page, might be a bad idea consider making private and rely on afAuth.idToken event
	setApiAuthToken = (token?: string) => {
		this.authToken = token;
	};

	public post<T>(endpoint: string, body: any): Observable<T> {
		console.log('post()', endpoint);
		const url = this.baseUrl + endpoint;
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.post<T>(url, body, {
				headers: this.headers(),
			})
		);
	}

	public put<T>(endpoint: string, body: any): Observable<T> {
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.put<T>(this.baseUrl + endpoint, body, {
				headers: this.headers(),
			})
		);
	}

	public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.get<T>(this.baseUrl + endpoint, {
				headers: this.headers(),
				params,
			})
		);
	}

	public getAsAnonymous<T>(
		endpoint: string,
		params?: HttpParams,
	): Observable<T> {
		return this.httpClient.get<T>(this.baseUrl + endpoint, {
			params,
		});
	}

	public delete<T>(endpoint: string, params: HttpParams): Observable<T> {
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.delete<T>(this.baseUrl + endpoint, {
				params,
				headers: this.headers(),
			})
		);
	}

	private errorIfNotAuthenticated(): Observable<never> | undefined {
		return (
			(!this.authToken &&
				throwError(() => userIsNotAuthenticatedNoFirebaseToken)) ||
			undefined
		);
	}

	private headers(): HttpHeaders {
		let headers = new HttpHeaders();
		if (this.authToken) {
			headers = headers.append('Authorization', 'Bearer ' + this.authToken);
		}
		return headers;
	}
}