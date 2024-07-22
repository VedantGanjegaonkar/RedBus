import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BusCreateComponent } from './bus-create/bus-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteCreateComponent } from './route-create/route-create.component';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    BusCreateComponent,
    RouteCreateComponent,
   
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
