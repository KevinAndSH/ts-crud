import { Request, Response } from "express";
import Post, { PostData } from "../core/entities/Post";
import { postService } from "./services";

namespace PostController {
  export async function save(req: Request, res: Response) {
    const { content, username } = req.body

    if (!(content && username)) {
      return res.status(400).json({
        message: "Part of the body is missing",
        data: null
      })
    }

    const postData: PostData = { content, username }
    const savedPost = await postService.save(postData)
    res.status(201).json({
      data: savedPost
    })
  }

  export async function update(req: Request, res: Response) {
    const { id } = req.params
    const { content } = req.body

    if (!content) {
      return res.status(400).json({
        message: "Part of the body is missing",
        data: null
      })
    }

    try {
      const updatedPost = await postService.update(id, content)
      res.json({
        data: updatedPost
      })
    } catch (error) {
      res.status(404).json({
        message: error,
        data: null
      })
    }
  }

  export async function findAll(_: any, res: Response) {
    const posts: Post[] = await postService.findAll()
    res.json({
      count: posts.length,
      data: posts
    })
  }

  export async function findById(req: Request, res: Response) {
    const { id } = req.params
    const post = await postService.findById(id)

    if (post === null) res.status(404)
    res.json({
      data: post
    })
  }

  export async function findByUsername(req: Request, res: Response) {
    const { username } = req.params
    const posts: Post[] = await postService.findByUsername(username)
    res.json({
      count: posts.length,
      data: posts
    })
  }

  export async function deleteById(req: Request, res: Response) {
    const { id } = req.params
    const isDeleted = await postService.deleteById(id)

    if (isDeleted) {
      res.status(204)
    }
    else {
      res.status(404)
    }

    res.json()
  }
}

export default PostController
