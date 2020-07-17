import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../services/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, PriorityType } from '../shared/tasks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {

  @ViewChild('atForm') addTaskDirective;
  addTaskForm: FormGroup;
  task: Task;
  priorityType = PriorityType;
  errMsg: string;

  formErrors = {
    'taskname': '',
    'taskinfo': ''
  };

  validationMessages = {
    'taskname': {
      'required': 'taskname is Required !',
      'minlength': 'name should be atleast 2 chars',
      'maxlength': 'name was asked, not an essay !'
    },
    'taskinfo': {
      'required': 'taskinfo is required !',
      'minlength': 'taskinfo should be atleast 8 chars',
      'maxlength': 'taskinfo was asked, not an essay !'
    }
  };

  constructor(private router: Router, private fb: FormBuilder, public activeModal: NgbActiveModal, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.addTaskForm = this.fb.group({
      taskname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      taskinfo: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      duedate: [Date.now()],
      priority: ['']
    });

    this.addTaskForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.onValueChange();
  }

  onValueChange(data?: any) {
    if (!this.addTaskForm) { return; }
    const form = this.addTaskForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '\n';
            }
          }
        }
      }
    }
  }

  onSubmit(): void {
    this.task = this.addTaskForm.value;
    console.log(this.task);
    this.dashboardService.addTask(this.task)
      .subscribe(res => {
        this.activeModal.close(res.success);
        this.dashboardService.filter('Closed Modal');
      }, err => this.errMsg = <any>err);

    this.addTaskForm.reset();
    this.addTaskDirective.resetForm();
  }

}
