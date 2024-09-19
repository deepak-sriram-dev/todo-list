export async function createTodoItemAPI(
  item: string,
  todoId: number
): Promise<Response> {
  return await fetch(`/api/todo/${todoId}/todo-item`, {
    method: "POST",
    body: JSON.stringify({ itemName: item }),
  });
}

export async function getTodoItems(todoId: number): Promise<Response> {
  return await fetch(`/api/todo/${todoId}/todo-item`, {
    method: "GET",
  });
}