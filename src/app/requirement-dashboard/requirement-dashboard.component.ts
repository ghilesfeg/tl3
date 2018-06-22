import { Component, OnInit, Injectable, ViewChild, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { RequirementService } from '../service/requirement.service';
import { TreeviewConfig, TreeviewEventParser, TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { OrderDownlineTreeviewEventParser, TreeviewComponent, DownlineTreeviewItem } from 'ngx-treeview';
import { reverse, isNil, remove } from 'lodash';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActiveService } from '../service/active.service';
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
export class RequirementDashboardComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  items: TreeviewItem[];
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
  rows: any[];
  folderForm: FormGroup;
  reqForm: FormGroup;
  req: any;
  reqView: any;
  reqs = this.reqService.getRequirements();
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

  constructor(
      private fb: FormBuilder,
      private reqService: RequirementService,
      private activeService: ActiveService
    ) {
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
    this.items = this.reqService.getTreeRequirement();
    this.reqView = null;
    this.error = null;
  }
  ngAfterViewChecked() {

  }

  ngAfterContentChecked() {
    this.activeService.activeReq();
  }

  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    this.rows = [];
    let myItem;
    downlineItems.forEach(downlineItem => {
        myItem = downlineItem.item;
        this.rows.push(myItem);
        this.req = myItem;
    });
    if (this.rows.length > 0) {
        this.reqs.map(e => {
            if (e.id === myItem.value) {
             this.reqView = e;
            }
        });
        this.items.map(item => {
            if (item !== undefined) {
                if (item.children !== undefined && item.children.length > 0) {
                    item.children.map(i => {
                        if (i !== undefined) {
                            if (i.value !== myItem.value) {
                                i.checked = false;
                                // i.disabled = true;
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
                            // i.disabled = false;
                        }
                    });
                }
            }
        });
    }
}

getDate() {
    return new Date();
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
                    // i.disabled = false;
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
            e.children.map(item => {
                if (item.text !== '') {
                    count++;
                }
            });
        }
    });
    return count;
}

updateReq(item) {
    this.req = item;
}

addReq() {
    let added = false;
    let t;
    let id;
    if (this.req.children === undefined) {
        this.items.map(e => {
          if (e.children !== undefined) {
            e.children.map(item => {
              if (item.text === this.req.text) {
                this.req = e;
              }
            });
          }
        });
      }
    if (this.reqForm.valid) {
        this.req.children.map(e => {
            if (e.text === '') {
                e.text = this.reqForm.value.reqName;
                id = Math.random();
                e.value = id;
                e.checked = true;
                added = true;
                t = e;
                this.req = e;
            }
        });
        if (!added) {
            console.log('first insetion');
            id = Math.random();
            t = new TreeviewItem({ text: this.reqForm.value.reqName, value: id, checked: true });
            this.req.children.push(t);
        }
        this.reqService.addRequirement(this.reqForm.value, id);
        console.log(this.reqs);
        this.reqs.map(r => {
            console.log(r.id + ' | ' + t.value);
            if (r.id === t.value) {
                this.reqView = r;
            }
        });
        if (!this.reqForm.value.checked) {
            $('#addReq').modal('hide');
            this.error = null;
        }
        this.reqForm.reset();
        this.reqForm.controls['critic'].setValue('Non définie', {onlySelf: true});
        this.reqForm.controls['category'].setValue('Non définie', {onlySelf: true});
        this.treeviewComponent.raiseSelectedChange();
    } else {
        this.error = 'Veuillez saisir le nom du dossier d\'exigence à ajouter ';
    }
}

renameReq() {
    if (this.reqForm.valid) {
        this.items.map(item => {
            item.children.map(i => {
                if (i.text === this.req.text) {
                    i.text = this.reqForm.value.reqName;
                }
            });
        });
        this.reqService.renameRequirement(this.reqForm.value, this.req);
        console.log(this.reqs);
        $('#editReq').modal('hide');
        this.error = null;
        this.reqForm.reset();
    } else {
        this.error = 'Le nom de l\'exigence est requis !';
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
            this.error = null;
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
