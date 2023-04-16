import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  baseURL = environment.baseURL;
  // baseURL = environment.devBaseURL;
  constructor(private readonly http: HttpClient) {}
  post<T>(url: string, body: unknown, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(function (key) {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.post<T>(`${this.baseURL}${url}`, body, {
      params: httpParams,
    });
  }
  get<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.get<T>(`${this.baseURL}${url}`, { params: httpParams });
  }
  put<T>(url: string, body: unknown, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(function (key) {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.put<T>(`${this.baseURL}${url}`, body, {
      params: httpParams,
    });
  }
  delete<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(function (key) {
        httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.delete<T>(`${this.baseURL}${url}`, { params: httpParams });
  }
}
