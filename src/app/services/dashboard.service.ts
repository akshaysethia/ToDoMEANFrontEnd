import { Injectable } from '@angular/core';
import { Task, TaskWithId } from '../shared/tasks';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ErrorprocessorService } from './errorprocessor.service';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseURL';

interface Gettask {
  success: boolean;
  tasks: Task[];
  message: string;
}

interface AddTask {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  addMessage: string;
  id: TaskWithId;
  private _listener = new Subject<any>();

  constructor(private http: HttpClient, private errorProcessorService: ErrorprocessorService) { }

  getTasks(): Observable<any> {
    return this.http.get<Gettask>(baseURL + '/todo/all')
      .pipe(map(res => {
        return { 'success': res.success, 'task': res.tasks, 'message': res.message };
      }))
      .pipe(catchError(this.errorProcessorService.handleError));
  }

  addTask(task: Task): Observable<any> {
    return this.http.post<AddTask>(baseURL + '/todo/add', task)
      .pipe(map(res => {
        this.addMessage = res.message;
        return ({ 'success': res.success, 'message': res.message });
      }))
      .pipe(catchError(this.errorProcessorService.handleError));
  }

  getEditId(): TaskWithId {
    return this.id;
  }

  editTask(id: string, task: Task): Observable<any> {
    return this.http.put<AddTask>(baseURL + '/todo/up/' + id, task)
      .pipe(map(res => {
        return { success: res.success, message: res.message };
      }))
      .pipe(catchError(this.errorProcessorService.handleError));
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete<AddTask>(baseURL + '/todo/del/' + id)
      .pipe(map(res => {
        return { success: res.success, message: res.message };
      }))
      .pipe(catchError(this.errorProcessorService.handleError));
  }

  deleteAllTasks(): Observable<any> {
    return this.http.delete<AddTask>(baseURL + '/todo/delAll')
      .pipe(map(res => {
        return { 'success': res.success, 'message': res.message };
      }))
      .pipe(catchError(this.errorProcessorService.handleError));
  }

  listen(): Observable<any> {
    return this._listener.asObservable().pipe(map(res => { return this.addMessage; }));
  }

  filter(filterBy: string) {
    this._listener.next(filterBy);
  }
}
