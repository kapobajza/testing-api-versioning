import {
  createApiClient,
  createApiClientV2,
  createApiClientV3,
} from "./client";
import { ApiClient } from "./types";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

// Will resolve to `https://{baseUrl}/todos`
const todoRepositoryUnversioned = createApiClient("todos");

// Will resolve to `https://{baseUrl}/v1/todos`
const todoRepositoryV1 = createApiClientV2("todos");

// Will resolve to `https://{baseUrl}/v2/todos`
const todoRepositoryV2 = createApiClientV2("todos");

// Will resolve to `https://{baseUrl}/v3/todos`
const todoRepositoryV3 = createApiClientV3("todos");

const getTodos = async (repo: ApiClient) => {
  let todos: Todo[] = [];

  try {
    todos = await repo.get<Todo[]>({
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
