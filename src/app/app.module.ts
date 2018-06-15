import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UseCasesService } from './service/use-cases.service';
import { RouterModule, Routes } from '@angular/router';
import { RequirementDashboardComponent } from './requirement-dashboard/requirement-dashboard.component';
import { RequirementComponent } from './requirement/requirement.component';
import { TreeviewModule } from 'ngx-treeview';
import { RequirementService } from './service/requirement.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AppComponent },
  { path: 'req', component: RequirementDashboardComponent},
  { path: 'req/:reqId', component: RequirementComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    RequirementDashboardComponent,
    RequirementComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    TreeviewModule.forRoot()
  ],
  providers: [
    UseCasesService,
    RequirementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
