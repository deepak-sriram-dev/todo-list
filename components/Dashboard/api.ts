export async function getTodoList(): Promise<Response> {
  return await fetch("/api/todo", {
    method: "GET",
    headers: { "Cache-Control": "no-cache" },
  });
}

export async function createTodo() {
  return await fetch("/api/todo", {
    method: "POST",
    body: JSON.stringify({ title: "untitled" }),
  });
}

export async function deleteTodo(id: number) {
  return await fetch(`/api/todo/${id}`, {
    method: "DELETE",
  });
}
