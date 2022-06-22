import Post, { PostData } from "../entities/Post";

export default interface PostRepository {
  ensureConnection(): Promise<void>

  savePost(postData: PostData): Promise<Post>
  updatePost(id: string, content: string): Promise<Post>
  
  findAll(): Promise<Post[]>
  findPostById(id: string): Promise<Post|null>
  findPostsByUsername(username: string): Promise<Post[]>

  deleteById(id: string): Promise<boolean>
  dangerouslyDeleteAllSavedPosts(): Promise<void>
}
