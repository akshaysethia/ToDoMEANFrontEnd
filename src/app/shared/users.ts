import { Task } from './tasks';

export class User {
    name: string;
    username: string;
    email: string;
    password: string;
    tasks: Task[];
}