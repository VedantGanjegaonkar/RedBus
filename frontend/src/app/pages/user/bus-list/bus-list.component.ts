// bus-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BusService } from 'src/app/core/services/bus.service';
import { ActivatedRoute } from '@angular/router';
import { ProductQueryParams } from 'src/app/core/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss']
})
export class BusListComponent implements OnInit {
  buses: any[] = [];
  queryParams: ProductQueryParams = {};

  constructor(
    private busService: BusService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParams = {
        from: params['from'],
        to: params['to'],
        date: params['date']
      };
      this.loadBuses();
    });
  }

  loadBuses(): void {
    this.busService.getBuses(this.queryParams).subscribe(
      (data) => {
        console.log(data);
        this.buses = data;
      },
      (error) => {
        console.error('Error fetching buses:', error);
      }
    );
  }

  viewDetails(busId: string): void {
    this.router.navigate(['/pages/user/bus', busId,this.queryParams]);
  }
}