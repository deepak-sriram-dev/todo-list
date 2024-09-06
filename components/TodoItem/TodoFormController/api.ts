export async function updateTodoItem(
  todoId: number,
  todoItemId: number,
  updateColumn: string,
  updateValue: number | string | boolean
): Promise<Response> {
  return await fetch(`/api/todo/${todoId}/todo-item/${todoItemId}`, {
    method: "PUT",
    body: JSON.stringify({ updateColumn, updateValue }),
  });
}

export async function deleteTodoItem(
  todoId: number,
  todoItemId: number
): Promise<Response> {
  return await fetch(`/api/todo/${todoId}/todo-item/${todoItemId}`, {
    method: "DELETE",
  });
}
