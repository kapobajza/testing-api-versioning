import { BaseApi } from "./baseApi";
import { ApiClient, ApiClientV1, ApiClientV2, ApiClientV3 } from "./client";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// Will resolve to `https://{baseUrl}/todos`
const todoRepositoryUnversioned = new ApiClient("todos");

// Will resolve to `https://{baseUrl}/v1/todos`
const todoRepositoryV1 = new ApiClientV1("todos");

// Will resolve to `https://{baseUrl}/v2/todos`
const todoRepositoryV2 = new ApiClientV2("todos");

// Will resolve to `https://{baseUrl}/v3/todos`
const todoRepositoryV3 = new ApiClientV3("todos");

const getTodos = async (repo: BaseApi) => {
  let todos: Todo[] = [];

  try {
    todos = await repo.getRequest<Todo[]>({
      queryParams: {
        limit: 1,
      },
    });
  } catch (err) {}

  return todos;
};

const main = async () => {
  const v1Todos = await getTodos(todoRepositoryV1);
  const v2Todos = await getTodos(todoRepositoryV2);
  const v3Todos = await getTodos(todoRepositoryV3);
  const unversionedTodos = await getTodos(todoRepositoryUnversioned);
  console.log("-------unversionedTodos-------");
  console.log(unversionedTodos);
  console.log("-------unversionedTodos-------\n");
};

main();
