import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor() { }

  getRequirements(): any {
    const fruitCategory = new TreeviewItem(
      {
        text: 'Fruit',
        value: 1,
        children: [
          {
            text: 'Apple',
            value: 11,
            checked: false
          },
          {
            text: 'Mango',
            value: 12,
            checked: false
          }
      ]
  });
  const vegetableCategory = new TreeviewItem(
    {
      text: 'Vegetable',
      value: 2,
      children: [
          {
            text: 'Salad',
            value: 21,
            checked: false
          },
          {
            text: 'Potato',
            value: 22,
            checked: false
          }
      ]
  });
  vegetableCategory.children.push(new TreeviewItem({ text: 'Mushroom', value: 23, checked: false }));
  vegetableCategory.correctChecked(); // need this to make 'Vegetable' node to change checked value from true to false
  return [fruitCategory, vegetableCategory];
  }
}
