import { isToday } from "date-fns"

export function getTodosDueToday(projectList) {
  const dueToday = []
  for (const project of projectList.list)
    for (const todoList of project.list)
      for (const todo of todoList.list) {
        if (isToday(todo.dueDate)) dueToday.push(todo)
      }
  return dueToday
}
