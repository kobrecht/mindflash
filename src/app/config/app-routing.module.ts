import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailComponent } from '../detail/detail.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
  { path:'login', component:LoginComponent },
  { path:'detail', component:DetailComponent },
  { path:'home', component:HomeComponent },
  { path:'', redirectTo:'/login', pathMatch:'full' }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
