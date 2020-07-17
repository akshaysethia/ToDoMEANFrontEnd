export class Task {
    taskname: string;
    taskinfo: string;
    duddate: Date;
    priority: string;
}

export const PriorityType = ['Low', 'Medium', 'High'];

export class TaskWithId {
    _id: string;
    taskname: string;
    taskinfo: string;
    duddate: Date;
    priority: string;
}