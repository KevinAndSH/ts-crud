import request from "supertest"
import { expect } from "chai"
import app from "../app"
import Post from "../core/entities/Post"
import createMockPost from "../helpers/createMockPost"
import { postService } from "../controllers/services"

const api = request(app)

const FAKE_ID = "0000000000000000000000000000000"

before(async () => {
  await postService.ensureConnection()
  await postService.dangerouslyDeleteAllSavedPosts()
})

describe("GET /posts", async () => {
  it("should return an array of posts", async () => {
    const res = await api
      .get("/posts")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      
    const posts: Post[] = res.body.data
    expect(posts).to.be.an("array")
  })
})

describe("POST /posts", async () => {
  const newPost = createMockPost()

  it("should save a post", async () => {
    const res = await api
      .post("/posts")
      .send(newPost)
      .expect(201)
      .expect("Content-Type", /json/)

    const { content, username }: Post = res.body.data
    expect({ content, username }).to.deep.equal(newPost)
  })

  it("should send the post saved before", async () => {
    const res = await api
      .get("/posts")
      .expect("Content-Type", /json/)
      .expect(200)

    const savedPosts: Post[] = res.body.data
    expect(savedPosts).to.have.a.lengthOf(1)

    const { content, username } = savedPosts[0]
    expect({ content, username }).to.deep.equal(newPost)
  })

  it("should send a 400 if the body is incomplete", async () => {
    const { content, username } = createMockPost()

    const res1 = await api
      .post("/posts")
      .send({ content })
      .expect(400)

    expect(res1.body.data).to.be.null

    const res2 = await api
      .post("/posts")
      .send({ username })
      .expect(400)

    expect(res2.body.data).to.be.null

    const res3 = await api
      .post("/posts")
      .send({ username, content })
      .expect(201)

    expect(res3.body.data).to.be.an("object")
  })

  it("should not have saved from the previous bad requests", async () => {
    const res = await api
      .get("/posts")
      .expect("Content-Type", /json/)
      .expect(200)

    const posts: Post[] = res.body.data
    expect(posts).to.be.an("array")
  })
})

describe("GET /posts/:id", async () => {
  it("should send a specific post given an id", async () => {
    const newPost = createMockPost()
    const res1 = await api
      .post("/posts")
      .send(newPost)
      .expect(201)
      .expect("Content-Type", /json/)

    const savedPost: Post = res1.body.data
    const { id, content, username } = savedPost
    expect({ content, username }).to.deep.equal(newPost)

    const res2 = await api
      .get("/posts/" + id)
      .expect("Content-Type", /json/)
      .expect(200)

    const gottenPost: Post = res2.body.data
    expect(gottenPost).to.deep.equal(savedPost)
  })

  it("should send a 404 when given an invalid id", async () => {
    const res = await api
      .get("/posts/" + FAKE_ID)
      .expect("Content-Type", /json/)
      .expect(404)

    expect(res.body.data).to.be.null
  })
})

describe("PUT /posts/:id", () => {
  let testId: string

  it("should edit an existing post", async () => {
    const newPost = createMockPost()
    const res1 = await api
      .post("/posts")
      .send(newPost)
      .expect(201)
      .expect("Content-Type", /json/)

    const { id }: Post = res1.body.data
    testId = id
    const { content: newContent } = createMockPost()

    const res2 = await api
      .put("/posts/" + testId)
      .send({ content: newContent })
      .expect(200)
      .expect("Content-Type", /json/)

    const editedPost: Post = res2.body.data
    expect(editedPost.content).to.equal(newContent)

    const res3 = await api
      .get("/posts/" + id)
      .expect("Content-Type", /json/)
      .expect(200)

    expect(res3.body.data).to.deep.equal(editedPost)
  })

  it("should throw a 400 when no content is sent", async () => {
    const res = await api
      .put("/posts/" + testId)
      .send({})
      .expect(400)

    expect(res.body.data).to.be.null
  })

  it("should send a 404 if there's no post with the given id", async () => {
    const res = await api
      .put("/posts/" + FAKE_ID)
      .send({ content: "content" })
      .expect(404)

    expect(res.body.data).to.be.null
  })
})

describe("DELETE /posts/:id", () => {
  it("should delete a post given an id and send a 204", async () => {
    const newPost = createMockPost()
    const res = await api
      .post("/posts")
      .send(newPost)
      .expect(201)
      .expect("Content-Type", /json/)

    const { id }: Post = res.body.data

    await api
      .delete("/posts/" + id)
      .expect(204)

    await api
      .get("/posts/" + id)
      .expect(404)
  })

  it("should send a 404 if there's no post with the given id", async () => {
    await api
      .delete("/posts/" + FAKE_ID)
      .expect(404)
  })
})

describe("GET /users/:username/posts", () => {
  it("should send posts with the given username", async () => {
    const newPost = createMockPost()
    const res1 = await api
      .post("/posts")
      .send(newPost)
      .expect(201)

    const { username }: Post = res1.body.data

    const res2 = await api
      .get("/users/" + username + "/posts")
      .expect(200)

    const posts: Post[] = res2.body.data
    expect(posts).to.be.an("array").with.length.of.at.least(1)
    posts.forEach(post => expect(post.username).to.equal(username))
  })
})
