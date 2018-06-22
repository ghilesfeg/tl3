import { Component, OnInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { UseCasesService } from './service/use-cases.service';
import { Observable } from 'rxjs';
import { ActiveService } from './service/active.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  title = 'TestLink 3.0';
  active = 0;
  constructor(private activeService: ActiveService) {
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {

  }

  ngAfterContentChecked() {
    this.activeSidebar();
  }

  toggle() {
    $('#sidebar').toggleClass('active');
  }

  activeSidebar() {
    return this.activeService.active;
  }

}
