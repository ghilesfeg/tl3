import { Component, OnInit, Injectable, ViewChild, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { TreeviewConfig, TreeviewEventParser, TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { OrderDownlineTreeviewEventParser, TreeviewComponent, DownlineTreeviewItem } from 'ngx-treeview';
import { reverse, isNil, remove } from 'lodash';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '../service/test.service';
import { ActiveService } from '../service/active.service';
declare var $: any;

@Injectable()
export class TestTreeviewConfig extends TreeviewConfig {
    hasAllCheckBox = false;
    hasFilter = false;
    hasCollapseExpand = false;
    maxHeight = 1000;
}

@Component({
  selector: 'app-test-dashboard',
  templateUrl: './test-dashboard.component.html',
  styleUrls: ['./test-dashboard.component.css'],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    { provide: TreeviewConfig, useClass: TestTreeviewConfig }
  ]
})
export class TestDashboardComponent implements OnInit, AfterViewChecked, AfterContentChecked {
  items: TreeviewItem[];
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
  rows: any[];
  folderForm: FormGroup;
  testForm: FormGroup;
  stepForm: FormGroup;
  test: any;
  tests = [];
  error: String;
  steps: any[];
  addStep = false;

  constructor(private fb: FormBuilder, private testService: TestService, private activeService: ActiveService) {
    this.folderForm = this.fb.group({
      'folderName' : ['', Validators.required],
      'checked': false
    });
    this.testForm = this.fb.group({
      'testName': ['', Validators.required],
      'checked': false,
      'reference' : [''],
      'description': ['']
    });
    this.stepForm = this.fb.group({
      'id': [''],
      'actions': ['', Validators.required],
      'expected': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.items = this.testService.getTreeTests();
    this.items.map(e => {
        if (e.children !== undefined) {
            e.children.map(it => {
                const t = {
                    'id': Math.random(),
                    'createdAt': '',
                    'testName': e.text,
                    'reference': '',
                    'description': '',
                    'status': '',
                    'importance': '',
                    'nature': '',
                    'steps': []
                };
                this.tests.push(t);
            });
        }
    });
    this.activeService.activeTest();
    this.error = null;
    this.steps = [];
  }
  ngAfterViewChecked() {

  }
  ngAfterContentChecked() {
    this.activeService.activeTest();
  }

  testCount() {
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

  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    this.rows = [];
    let myItem;
    downlineItems.forEach(downlineItem => {
        myItem = downlineItem.item;
        this.rows.push(myItem);
        this.test = myItem;
    });
    if (this.rows.length > 0) {
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

updateTest(item) {
    if (this.tests.length > 0) {
        this.tests.map(e => {
            if (e !== undefined) {
                if (e.testName === item.text) {
                    this.test = e;
                }
            }
        });
    } else {
        this.test = item;
    }
}

addTest() {
  let added = false;
  let t;
  let id;
  if (this.testForm.valid) {
    if (this.test.children === undefined) {
      this.items.map(e => {
        if (e.children !== undefined) {
          e.children.map(item => {
            if (item.text === this.test.text) {
              this.test = e;
            }
          });
        }
      });
    }
          this.test.children.map(e => {
            if (e.text === '') {
                e.text = this.testForm.value.testName;
                id = Math.random();
                e.value = id;
                e.checked = true;
                added = true;
                t = e;
                this.test = e;
            }
        });

      if (!added) {
          id = Math.random();
          t = new TreeviewItem({ text: this.testForm.value.testName, value: Math.random(), checked: true });
          this.test.children.push(t);
          added = true;
      }
      if (!this.testForm.value.checked) {
          $('#addTest').modal('hide');
          this.error = null;
      }
      this.testForm.reset();
      this.treeviewComponent.raiseSelectedChange();
  } else {
      this.error = 'Veuillez saisir le nom du dossier de test à ajouter ';
  }
}

editTest() {
  if (this.testForm.valid) {
      this.items.map(item => {
          item.children.map(i => {
              if (i.text === this.test.text) {
                  i.text = this.testForm.value.testName;
              }
          });
      });
      $('#editTest').modal('hide');
      this.error = null;
      this.testForm.reset();
  } else {
      this.error = 'Le nom du cas de test est requis !';
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
      this.error = 'Veuillez saisir le nom du dossier de test à ajouter ';
  }
}

folderControl() {
  if (this.folderForm.value.folderName === '') {
      this.error = 'Veuillez saisir le nom du dossier de test à ajouter ';
  } else {
      this.error = null;
  }
}

testControl() {
  if (this.testForm.value.testName === '') {
      this.error = 'Veuillez saisir le nom du cas de test à ajouter ';
  } else {
      this.error = null;
  }
}

getDate() {
  return new Date();
}

newStep() {
    if (this.stepForm.valid) {
        const step = {
            'id': Math.random(),
            'actions': this.stepForm.value.actions,
            'expected': this.stepForm.value.expected
        };
        this.steps.push(step);
        this.reset();
    }
}
notifyAdd() {
    this.addStep = true;
}
reset() {
    this.stepForm.reset();
    this.addStep = false;
}
}
