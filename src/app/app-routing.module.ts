import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthorDashboardComponent } from './components/author-dashboard/author-dashboard.component';
import { LandpageComponent } from './components/landpage/landpage.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ViewUploadedBookComponent } from './components/view-uploaded-book/view-uploaded-book.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path:'',component:LandpageComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'admin-dashboard',component:AdminDashboardComponent,canActivate:[AuthGuard]},
  {path:'author-dashboard',component:AuthorDashboardComponent,canActivate:[AuthGuard]},
  {path:'add_book',component:AddBookComponent,canActivate:[AuthGuard]},
  {path:'view_book',component:ViewUploadedBookComponent,canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
