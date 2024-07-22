// bus.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBookingRequest } from '../interfaces/interfaces';
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
  getBuses(): Observable<any[]> {
    return this.http.get<any[]>(`bus`);
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