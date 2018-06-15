import { Component, OnInit } from '@angular/core';
import { UseCasesService } from './service/use-cases.service';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TestLink 3.0';
  use_cases = [];
  constructor(private cases: UseCasesService) {
  }

  ngOnInit() {
    this.cases.getAll().subscribe(u => this.use_cases = u.use_cases);
    console.log(this.use_cases);
  }

  toggle() {
    $('#sidebar').toggleClass('active');
  }
}
