import "./styles.css"
import "./main-page/main-page"
import storage from "./services/storage"
import { ProjectList } from "./components/project/projectlist"
import { getTodosDueToday } from "./components/utils/gettodosduetoday"
import { addDays } from "date-fns"
import { addHours } from "date-fns"

// const projectList = new ProjectList().addItem("Project 1")
// projectList.getItem().addItem("TodoList 1").addItem("TodoList 2")
// let project = projectList.getItem()

// let todoList = project.getItem("TodoList 1")
// todoList.addItem("Ride a Person")
// todoList.addItem("Ride a Bike")

// todoList = project.getItem("TodoList 2")
// todoList.addItem("Fly a Plane")
// todoList.addItem("Fly a Helicopter").getItem().dueDate = addHours(new Date(), 3)
// console.log(projectList)

// console.dir(getTodosDueToday(projectList))
