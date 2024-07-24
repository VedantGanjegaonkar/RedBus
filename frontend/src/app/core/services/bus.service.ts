// bus.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBookingRequest } from '../interfaces/interfaces';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusService {
 

  constructor(private http: HttpClient) { }

  getRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`routes`);
  }

  createRoute(routeData: any): Observable<any> {
    return this.http.post(`routes`, routeData);
  }

  createBus(busData: any): Observable<any> {
    return this.http.post(`bus`, busData);
  }

  getBuses(params: any): Observable<any> {  
    let param = new HttpParams();

    if (params) {
      if (params.from) {
        param = param.set('from', params.from);
      }
      if (params.to) {
        param = param.set('to', params.to);
      }
      if (params.date) {
        // Convert the date to a string in ISO format
        param = param.set('date', params.date);
      }
    }

    return this.http.get('bus', { params: param });
  }

  getBusById(id: string): Observable<any> {
    return this.http.get<any>(`bus/${id}`);
  }

  //booking api
  bookApi(bookData:IBookingRequest): Observable<any> {
    return this.http.post<any>(`booking`,bookData);
  }

  getBookingDetails(): Observable<any> {
    return this.http.get<any>(`booking`);
  }
}