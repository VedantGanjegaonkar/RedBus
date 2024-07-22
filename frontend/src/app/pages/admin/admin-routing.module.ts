import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BusCreateComponent } from './bus-create/bus-create.component';
import { RouteCreateComponent } from './route-create/route-create.component';

const routes: Routes = [{ path: '', component: AdminComponent },
  {path: 'dashboard' , component: DashboardComponent},
  {path:"create-bus",component:BusCreateComponent},
  {path:"create-route",component:RouteCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
