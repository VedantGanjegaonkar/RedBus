// bus-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BusService } from 'src/app/core/services/bus.service';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss']
})
export class BusListComponent implements OnInit {
  buses: any[] = [];

  constructor(private busService: BusService) { }

  ngOnInit(): void {
    this.loadBuses();
  }

  loadBuses(): void {
    this.busService.getBuses().subscribe(
      (data) => {
        console.log(data);
        this.buses = data;
      },
      (error) => {
        console.error('Error fetching buses:', error);
      }
    );
  }
}