import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

  getTreeTests(): any {
    const project1 = new TreeviewItem(
      {
        text: 'Projet 1',
        value: 1,
        children: [
          {
            text: '',
            value: 11,
            checked: false
          }
      ]
  });
  const project2 = new TreeviewItem(
    {
      text: 'Projet 2',
      value: 2,
      children: [
          {
            text: '',
            value: 21,
            checked: false
          }
      ]
  });
  return [project1, project2];
  }
}
