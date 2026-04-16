import { randomUUID } from 'crypto'

export class IdGeneratorAdapter {
  async execute() {
    return randomUUID()
  }
}
