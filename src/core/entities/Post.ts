export interface PostData {
  content: string
  username: string
}

export default interface Post extends PostData {
  id: string
  content: string
  username: string
  postedAt: Date
  updatedAt: Date
}
