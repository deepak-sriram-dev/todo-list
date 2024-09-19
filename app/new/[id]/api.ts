export async function getTodo(id: number): Promise<Response> {
  return await fetch(`/api/todo/${id}`, {
    method: "GET",
    headers: { "Cache-Control": "no-cache" },
  });
}

export async function updateTodo(
  id: number,
  updateValue: string
): Promise<Response> {
  return await fetch(`/api/todo/${id}`, {
    method: "PUT",
    body: JSON.stringify({ updateValue }),
  });
}
