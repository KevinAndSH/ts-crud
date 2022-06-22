import { faker } from '@faker-js/faker'
import { PostData } from '../core/entities/Post';

export default function createMockPost(): PostData {
  const content: string = faker.lorem.sentences()
  const username: string = faker.internet.userName()

  return { username, content }
}
