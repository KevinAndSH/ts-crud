import PostService from "../core/services/PostService"
import PostRepositoryInMemory from "../in-memory-repositories/PostRepositoryInMemory"
import PostRepositoryRedis from "../redis-repositories/PostRepositoryRedis"

const { NODE_ENV, REDIS_URL } = process.env

const POST_DB_KEY = NODE_ENV === "test" ? "PostDB_test.json" : "PostDB.json"
const postRepoInMemory = new PostRepositoryInMemory(POST_DB_KEY)
const postRepoRedis = new PostRepositoryRedis(REDIS_URL as string)

export const postService = new PostService(postRepoInMemory)

// ;(async () => {
//   const val = await postService.findById("235e81ff-4c93-4404-b6ef-1d5a8b3071b4")
//   console.log(val)  
// })()
