import { HttpClient, HttpParams } from "@angular/common/http";
import { map, of } from "rxjs";
import { PaginationResult } from "../models/pagination";

export function getPaginatedResult<T>(
	url: string,
	params: HttpParams,
	http: HttpClient,
	cachedData: Map<string, PaginationResult<T>>,
	cacheKey: string
	) {
	// Check if data is already cached
	if (cachedData.has(cacheKey)) {
		console.log('Using cached data');
		return of(cachedData.get(cacheKey));
	}

	// If not cached, fetch data from server
	return http.get<T>(url, { observe: 'response', params }).pipe(
		map((res) => {
			const paginatedResult = new PaginationResult<T>();
			
			// Save response to cache
			if (res.body) {
				paginatedResult.result = res.body;
			}

			const pagination = res.headers.get('Pagination');
			
			

			if (pagination) {
				paginatedResult.pagination = JSON.parse(pagination);
			}

			cachedData.set(cacheKey, paginatedResult);
			return paginatedResult;
		})
	);
}

export function generatePaginationParams(pageNumber: number, pageSize: number) {
	return new HttpParams()
		.set('pageNumber', pageNumber.toString())
		.set('pageSize', pageSize.toString());
}