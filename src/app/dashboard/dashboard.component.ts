import { Component, OnInit, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { Task, TaskWithId } from '../shared/tasks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { EditTodoComponent } from '../edit-todo/edit-todo.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username: string = undefined;
  subscription: Subscription;
  tasks: Task[];
  errMsg: string;
  noTask: boolean = false;
  addtask: string;

  constructor(private authService: AuthService, private dashboardService: DashboardService, private modalService: NgbModal) {
    this.dashboardService.listen()
      .subscribe(res => {
        this.fetchTasks();
        this.addtask = res;
        this.noTask = false;
        setTimeout(() => {
          this.addtask = null;
        }, 4000);
      });
  }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(name => this.username = name, err => this.errMsg = <any>err);

    this.fetchTasks();
  }

  fetchTasks(): void {
    this.dashboardService.getTasks()
      .subscribe(res => {
        if (res.success) {
          if (res.task.length > 0) {
            this.tasks = res.task;
          } else {
            this.tasks = [];
            this.noTask = true;
          }
        } else {
          this.tasks = null;
          console.log(res.message);
        }
      }, err => this.errMsg = <any>err);
  }

  openAddTask(): void {
    this.modalService.open(AddTodoComponent, { centered: true, keyboard: true });
  }

  openEdit(id: TaskWithId): void {
    this.dashboardService.id = id;
    this.modalService.open(EditTodoComponent, { centered: true, keyboard: true });
  }

  delete(id: string): void {
    this.dashboardService.deleteTask(id)
      .subscribe(res => {
        this.fetchTasks();
        this.addtask = res.message;
        setTimeout(() => {
          this.addtask = null;
        }, 4000);
      }, err => this.errMsg = <any>err);
  }

  deleteAll(): void {
    this.dashboardService.deleteAllTasks()
      .subscribe(res => {
        this.fetchTasks();
        this.addtask = res.message;
        setTimeout(() => {
          this.addtask = null;
        }, 4000);
      }, err => this.errMsg = <any>err);
  }
}
