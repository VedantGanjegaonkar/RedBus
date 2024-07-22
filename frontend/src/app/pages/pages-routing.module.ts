import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: PagesComponent, children: [
    { path: 'admin',canActivate:[AdminGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  ] },

];

@NgModule({
  imports: [RouterModule.forChild(routes), LayoutsModule],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
