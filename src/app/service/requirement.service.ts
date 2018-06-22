import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private requirements = [];
  constructor() { }

  getTreeRequirement(): any {
    let treq = [];
    const Project1Category = new TreeviewItem(
      {
        text: 'Projet 1',
        value: 1,
        children: [
          {
            text: 'Req 1',
            value: 11,
            checked: false
          },
          {
            text: 'Req 2',
            value: 12,
            checked: false
          }
      ]
  });
  const Project2Category = new TreeviewItem(
    {
      text: 'Projet 2',
      value: 2,
      children: [
          {
            text: 'Req 3',
            value: 21,
            checked: false
          },
          {
            text: 'Req 4',
            value: 22,
            checked: false
          }
      ]
  });
  Project2Category.children.push(new TreeviewItem({ text: 'Req 5', value: 23, checked: false }));
  Project2Category.correctChecked(); // need this to make 'Vegetable' node to change checked value from true to false
  treq = [Project1Category, Project2Category];
  treq.map(e => {
    e.children.map(item => {
      const req = {
        'id': item.value,
        'createdAt': '',
        'reqName': item.text,
        'reference': '',
        'description': '',
        'status': '',
        'critical': '',
        'category': '',
        'steps': [],
        'cases': []
      };
      this.requirements.push(req);
    });
  });
  return treq;
  }

  getRequirements(): any {
    return this.requirements;
  }

  addRequirement(req, id) {
    const t = {
      'id': id,
      'createdAt': new Date(),
      'reqName': req.reqName,
      'reference': req.reference,
      'description': req.description,
      'status': 'En cours de rédaction',
      'critical': req.critic,
      'category': req.category,
      'steps': [],
      'cases': []
    };
    this.requirements.push(t);
  }

  renameRequirement(req, value) {
    this.requirements.map(item => {
      if (item.id === value.value) {
        item.reqName = req.reqName;
      }
    });
  }

  editRequirement(req) {
    this.requirements.map(item =>  {
      if (item.value === req.value) {
        item.reqName = req.reqName;
        item.reference = req.reference;
        item.description = req.description;
        item.critical = req.critic;
        item.category = req.category;
      }
    });
  }
}
