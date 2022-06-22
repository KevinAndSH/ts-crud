import Post, { PostData } from "../entities/Post"
import PostRepository from "../repositories/PostRepository"

export default class PostService {
  constructor(
    private postRepo: PostRepository
  ) {}

  ensureConnection() {
    return this.postRepo.ensureConnection()
  }

  findAll(): Promise<Post[]> {
    return this.postRepo.findAll()
  }

  findById(id: string): Promise<Post|null> {
    return this.postRepo.findPostById(id)
  }

  findByUsername(username: string): Promise<Post[]> {
    return this.postRepo.findPostsByUsername(username)
  }

  save(postData: PostData): Promise<Post> {
    return this.postRepo.savePost(postData)
  }

  update(id: string, content: string): Promise<Post> {
    return this.postRepo.updatePost(id, content)
  }

  deleteById(id: string): Promise<boolean> {
    return this.postRepo.deleteById(id)
  }

  dangerouslyDeleteAllSavedPosts(): Promise<void> {
    return this.postRepo.dangerouslyDeleteAllSavedPosts()
  }
}
