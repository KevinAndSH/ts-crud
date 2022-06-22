import { v4 as uuidv4 } from "uuid";
import Post, { PostData } from "../core/entities/Post";
import PostRepository from "../core/repositories/PostRepository";
import { readJson, saveJson } from "./utils";

export default class PostRepositoryInMemory implements PostRepository {
  private inMemoryDB: Post[]

  constructor(
    private readonly BACKUP_DB_KEY: string
  ) {
    this.inMemoryDB = readJson<Post>(this.BACKUP_DB_KEY)
  }

  private saveBackup() {
    return saveJson<Post>(this.BACKUP_DB_KEY, this.inMemoryDB)
  }

  private generateId(): string {
    return uuidv4()
  }

  ensureConnection(): Promise<void> {
    return Promise.resolve()
  }

  async savePost(postData: PostData): Promise<Post> {
    const newPost: Post = {
      id: this.generateId(),
      ...postData,
      postedAt: new Date(),
      updatedAt: new Date()
    }
    this.inMemoryDB.push(newPost)
    await this.saveBackup()
    return Promise.resolve(newPost)
  }

  async updatePost(id: string, content: string): Promise<Post> {
    for (const post of this.inMemoryDB) {
      if (post.id !== id) continue
      post.content = content
      post.updatedAt = new Date()
      await this.saveBackup()
      return Promise.resolve(post)
    }
    throw new Error("Post with the given id doesn't exist")
  }

  async findAll(): Promise<Post[]> {
    return Promise.resolve(this.inMemoryDB)
  }

  async findPostById(id: string): Promise<Post|null> {
    const post: Post | undefined = this.inMemoryDB.find(post => post.id === id)
    if (post) {
      return Promise.resolve(post)
    } else {
      return Promise.resolve(null)
    }
  }

  async findPostsByUsername(username: string): Promise<Post[]> {
    const posts: Post[] = this.inMemoryDB.filter(post => post.username === username)
    return Promise.resolve(posts)
  }

  async deleteById(id: string): Promise<boolean> {
    const previousMemorySize = this.inMemoryDB.length
    this.inMemoryDB = this.inMemoryDB.filter(post => post.id !== id)
    await this.saveBackup()
    return Promise.resolve(this.inMemoryDB.length < previousMemorySize)
  }

  async dangerouslyDeleteAllSavedPosts(): Promise<void> {
    this.inMemoryDB.length = 0
    await this.saveBackup()
  }
}
