import { v4 as uuidv4 } from "uuid";
import { createClient } from 'redis';
import Post, { PostData } from "../core/entities/Post";
import PostRepository from "../core/repositories/PostRepository";

export default class PostRepositoryRedis implements PostRepository {
  private client

  constructor(redisUrl: string) {
    this.client = createClient({
      url: redisUrl
    })
  }

  async ensureConnection() {
    return await this.client.connect()
  }

  private generateId(): string {
    return uuidv4()
  }

  private async saveInRedis(post: Post) {
    await this.ensureConnection()
    return await this.client.set(post.id, JSON.stringify(post))
  }

  private async getFromRedis(id: string): Promise<Post|null> {
    await this.ensureConnection()
    const entry = await this.client.get(id)

    if(entry === null) return null

    const post = JSON.parse(entry)
    post.postedAt = new Date(post.postedAt)
    post.updatedAt = new Date(post.updatedAt)
    return post
  }

  async savePost(postData: PostData): Promise<Post> {
    const id = this.generateId()
    const newPost: Post = {
      id, ...postData,
      postedAt: new Date(),
      updatedAt: new Date()
    }
    await this.saveInRedis(newPost)
    return newPost
  }

  async updatePost(id: string, content: string): Promise<Post> {
    const post = await this.getFromRedis(id)
    if (post === null) throw new Error("Post with the given id doesn't exist")

    post.content = content
    post.updatedAt = new Date()
    await this.saveInRedis(post)
    return post
  }

  async findAll(): Promise<Post[]> {
    await this.ensureConnection()
    //todo: fix this
    return []
  }

  async findPostById(id: string): Promise<Post | null> {
    return await this.getFromRedis(id)
  }

  async findPostsByUsername(username: string): Promise<Post[]> {
    const posts = await this.findAll()
    return posts.filter(post => post.username === username)
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureConnection()
    const deleteResult = await this.client.del(id)
    return Boolean(deleteResult)
  }

  async dangerouslyDeleteAllSavedPosts(): Promise<void> {
    await this.ensureConnection()
    await this.client.flushDb()
  }
}
