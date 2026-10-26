export interface Card{
    _id:string;
    title:string;
    description?:string;
    priority: "low" | "medium" | "high";
    columnId: string;
    createdAt?:string;
    updatedAt?:string;
}

export interface Card {
    _id: string;
    title: string;
    description?: string;
    columnId: string;
    boardId: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    assignedTo?: string;
    order: number; // <--- Add this property here
    createdAt?: string;
    updatedAt?: string;
}

export interface Column{
    _id:string;
    title:string;
    boardId:string;
    cards:Card[];
    order:number;
}

export interface Board{
    _id: string;
    title:string;
    description?:string;
    owner:string;
    columns: Column[];
    createdAt?: string;
    updatedAt?:string;
}

export interface ActivityLog {
    _id: string;
    action: string;
    details?: string;
    user: {
        _id: string;
        name?: string;
        email?: string;
    } | string;
    boardId: string;
    createdAt: string;
}