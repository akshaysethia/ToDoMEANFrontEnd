import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PriorityType, TaskWithId, Task } from '../shared/tasks';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {

  editTask: Task;
  @ViewChild('etForm') editTaskDirective;
  editTaskForm: FormGroup;
  priorityType = PriorityType;
  errMsg: string;
  id: string;

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

  constructor(private fb: FormBuilder, private dashboardService: DashboardService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    let edit: TaskWithId = this.dashboardService.getEditId();
    console.log(edit._id);
    this.id = edit._id;
    this.editTaskForm = this.fb.group({
      taskname: [edit.taskname, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      taskinfo: [edit.taskinfo, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      duedate: [edit.duddate],
      priority: [edit.priority]
    });

    this.editTaskForm.valueChanges
      .subscribe(data => this.onValueChange(data));

    this.onValueChange();
  }

  onValueChange(data?: any) {
    if (!this.editTaskForm) { return; }
    const form = this.editTaskForm;
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
    this.editTask = this.editTaskForm.value;
    this.dashboardService.editTask(this.id, this.editTask)
      .subscribe(res => {
        console.log(res);
        this.activeModal.close(res.success);
        this.dashboardService.filter('Closed Modal');
      }, err => this.errMsg = <any>err);
      
  }

}
