export interface TodoItemPropsInterface {
  todoId: number;
}

export interface TodoItemCheckListInterface {
  id: number;
  todo_id: number;
  todo_item: string;
  is_checked: boolean;
  is_deleted: boolean;
}