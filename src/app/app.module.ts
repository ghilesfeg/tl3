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
import { TestDashboardComponent } from './test-dashboard/test-dashboard.component';
import { TestService } from './service/test.service';
import { ActiveService } from './service/active.service';
import { StepComponent } from './step/step.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: AppComponent },
  { path: 'req', component: RequirementDashboardComponent},
  { path: 'test', component: TestDashboardComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    RequirementDashboardComponent,
    RequirementComponent,
    TestDashboardComponent,
    StepComponent
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
    RequirementService,
    TestService,
    ActiveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
