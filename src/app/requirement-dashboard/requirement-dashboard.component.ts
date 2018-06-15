import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { RequirementService } from '../service/requirement.service';
import { TreeviewConfig, TreeviewEventParser, TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { OrderDownlineTreeviewEventParser, TreeviewComponent, DownlineTreeviewItem } from 'ngx-treeview';
import { reverse, isNil, remove } from 'lodash';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Injectable()
export class ReqTreeviewConfig extends TreeviewConfig {
    hasAllCheckBox = false;
    hasFilter = false;
    hasCollapseExpand = false;
    maxHeight = 1000;
}

@Component({
  selector: 'app-requirement-dashboard',
  templateUrl: './requirement-dashboard.component.html',
  styleUrls: ['./requirement-dashboard.component.css'],
      providers: [
        { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
        { provide: TreeviewConfig, useClass: ReqTreeviewConfig }
    ]
})
export class RequirementDashboardComponent implements OnInit {
  items: TreeviewItem[];
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
  rows: any[];
  folderForm: FormGroup;
  reqForm: FormGroup;
  req: any;
  error: String;
  critics = ['Non définie', 'Mineure', 'Majeure', 'Critique'];
  categories = [
      'Non définie',
      'Fonctionnelle',
      'Non fonctionnelle',
      'Cas d\'utilisation',
      'Métier',
      'Exigence de test',
      'Ergonomique',
      'Performance',
      'Technique',
      'User Story',
      'Sécurité'
    ];
  constructor(private fb: FormBuilder, private reqService: RequirementService) {
      this.folderForm = this.fb.group({
        'folderName' : ['', Validators.required],
        'checked': false
      });
      this.reqForm = this.fb.group({
          'reqName': ['', Validators.required],
          'checked': false,
          'reference' : [''],
          'critic': new FormControl(null),
          'category': new FormControl(null),
          'description': ['']
      });
      this.reqForm.controls['critic'].setValue('Non définie', {onlySelf: true});
      this.reqForm.controls['category'].setValue('Non définie', {onlySelf: true});
  }

  ngOnInit() {
    this.items = this.reqService.getRequirements();
    this.error = null;
  }


  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    this.rows = [];
    let myItem;
    downlineItems.forEach(downlineItem => {
        myItem = downlineItem.item;
        this.rows.push(myItem);
    });
    if (this.rows.length > 0) {
        this.items.map(item => {
            if (item !== undefined) {
                if (item.children !== undefined && item.children.length > 0) {
                    item.children.map(i => {
                        if (i !== undefined) {
                            if (i.value !== myItem.value) {
                                i.checked = false;
                                i.disabled = true;
                            }
                        }
                    });
                }
            }
        });
    } else {
        this.items.map(item => {
            if (item !== undefined) {
                if (item.children !== undefined && item.children.length > 0) {
                    item.children.map(i => {
                        if (i !== undefined) {
                            i.checked = false;
                            i.disabled = false;
                        }
                    });
                }
            }
        });
    }
}


removeItem(item: TreeviewItem) {
    let isRemoved = false;
    for (const tmpItem of this.items) {
        if (tmpItem === item) {
            remove(this.items, item);
        } else {
            isRemoved = TreeviewHelper.removeItem(tmpItem, item);
            if (isRemoved) {
                break;
            }
        }
    }

    if (isRemoved) {
        this.rows = [];
        this.items.map(it => {
            if (it !== undefined) {
                it.children.map(i => {
                    i.checked = false;
                    i.disabled = false;
                });
            }
        });
        this.treeviewComponent.raiseSelectedChange();
    }
}

reqCount() {
    let count = 0;
    this.items.map(e => {
        if (e !== undefined && e.children !== undefined) {
            count = count + e.children.length;
        }
    });
    return count;
}

updateReq(item) {
    this.req = item;
}

addReq() {
    let added = false;
    if (this.reqForm.valid) {
        this.req.children.map(e => {
            if (e.text === '') {
                e.text = this.reqForm.value.reqName;
                e.value = Math.random();
                added = true;
            }
        });
        if (!added) {
            this.req.children.push(new TreeviewItem({ text: this.reqForm.value.reqName, value: Math.random(), checked: false }));
            added = true;
        }
        if (!this.reqForm.value.checked) {
            $('#addReq').modal('hide');
        }
        this.reqForm.reset();
        this.reqForm.controls['critic'].setValue('Non définie', {onlySelf: true});
        this.reqForm.controls['category'].setValue('Non définie', {onlySelf: true});
        this.treeviewComponent.raiseSelectedChange();
    } else {
        this.error = 'Veuillez saisir le nom du dossier d\'exigence à ajouter ';
    }
}

addFolder() {
    if (this.folderForm.valid) {
        this.items.push(new TreeviewItem({
                text: this.folderForm.value.folderName,
                value: Math.random(),
                checked: false,
                children: [new TreeviewItem({
                    text: '',
                    value: -1,
                    checked: false
                })]}));
        this.treeviewComponent.raiseSelectedChange();
        if (!this.folderForm.value.checked) {
            $('#addFolder').modal('hide');
        }
        this.folderForm.reset();
    } else {
        this.error = 'Veuillez saisir le nom du dossier d\'exigence à ajouter ';
    }
}

folderControl() {
    if (this.folderForm.value.folderName === '') {
        this.error = 'Veuillez saisir le nom du dossier d\'exigence à ajouter ';
    } else {
        this.error = null;
    }
}

reqControl() {
    if (this.reqForm.value.reqName === '') {
        this.error = 'Veuillez saisir le nom de l\'exigence à ajouter ';
    } else {
        this.error = null;
    }
}
}
