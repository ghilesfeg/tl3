import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveService {
  active = 0;
  constructor() { }

  activeNone() {
    return this.active = 0;
  }

  activeReq() {
    return this.active = 1;
  }

  activeTest() {
    return this.active = 2;
  }
}
