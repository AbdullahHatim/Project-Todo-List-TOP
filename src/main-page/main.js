import "./main-style.css"
import PubSub from "pubsub-js"
import { ProjectManager } from "@/services/projectsmanager"

const PROJECT_TOPIC = "Clicked-Project"

PubSub.subscribe(PROJECT_TOPIC, (msg, data) => {
  console.log(data)
})

//ADD main-content DIV
//copy from side.js
