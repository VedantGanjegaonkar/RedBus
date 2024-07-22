// bus-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusService } from 'src/app/core/services/bus.service'; 

@Component({
  selector: 'app-bus-create',
  templateUrl: './bus-create.component.html',
  styleUrls: ['./bus-create.component.scss']
})
export class BusCreateComponent implements OnInit {
  busForm!: FormGroup;
  routes: any[] = [] 

  constructor(
    private fb: FormBuilder,
    private busService: BusService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadRoutes();
  }

  initForm(): void {
    this.busForm = this.fb.group({
      bus_number: ['', Validators.required],
      bus_type: ['', Validators.required],
      route_id: ['', Validators.required]
    });
  }

  loadRoutes(): void {
    this.busService.getRoutes().subscribe(
      (data) => {
        this.routes = data;
      },
      (error) => {
        console.error('Error fetching routes:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.busForm.valid) {
      console.log(this.busForm.value);
      this.busService.createBus(this.busForm.value).subscribe(
        (response) => {
          console.log('Bus created successfully:', response);
          alert("bus created succesfully")
          // Reset form or navigate to another page
        },
        (error) => {
          console.error('Error creating bus:', error);
        }
      );
    }
  }
}