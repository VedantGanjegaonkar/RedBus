// route-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusService } from 'src/app/core/services/bus.service'; 

@Component({
  selector: 'app-route-create',
  templateUrl: './route-create.component.html',
  styleUrls: ['./route-create.component.scss']
})
export class RouteCreateComponent implements OnInit {
  routeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private routeService: BusService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.routeForm = this.fb.group({
      route_name: ['', Validators.required],
      start_point: ['', Validators.required],
      end_point: ['', Validators.required],
      stops: this.fb.array([]),
      total_distance: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get stops(): FormArray {
    return this.routeForm.get('stops') as FormArray;
  }

  addStop(): void {
    const stopForm = this.fb.group({
      stop_name: ['', Validators.required],
      stop_time: ['', Validators.required],
      distance_from_start: ['', [Validators.required, Validators.min(0)]]
    });
    this.stops.push(stopForm);
  }

  removeStop(index: number): void {
    this.stops.removeAt(index);
  }

  onSubmit(): void {
    if (this.routeForm.valid) {
      console.log(this.routeForm.value);
      this.routeService.createRoute(this.routeForm.value).subscribe(
        (response) => {
          console.log('Route created successfully:', response);
          alert("route succes:")
          // Reset form or navigate to another page
        },
        (error) => {
          console.error('Error creating route:', error);
        }
      );
    }
  }
}