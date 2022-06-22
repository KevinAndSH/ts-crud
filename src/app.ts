import express, { Application, Request, Response, Router } from "express"
import PostController from "./controllers/PostController"

const app: Application = express()

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hi"
  })
})

app.get("/posts", PostController.findAll)
app.get("/posts/:id", PostController.findById)
app.post("/posts", PostController.save)
app.put("/posts/:id", PostController.update)
app.get("/users/:username/posts", PostController.findByUsername)
app.delete("/posts/:id", PostController.deleteById)

export default app
