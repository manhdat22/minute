// TODO: for repository design pattern later

interface IBaseService<T> {
  find(params: {}): Promise<T[]>
  findOne(params: {}): Promise<T>
  findById(id: number | string): Promise<T[]>
  create(obj: T): Promise<void>
  update(id: number | string, obj: T): Promise<void>
}

export default class BaseService<T> implements IBaseService<T> {
  find(params: {}): Promise<T[]> {
    throw new Error('Method not implemented.')
  }
  findOne(params: {}): Promise<T> {
    throw new Error('Method not implemented.')
  }
  findById(id: string | number): Promise<T[]> {
    throw new Error('Method not implemented.')
  }
  create(obj: T): Promise<void> {
    throw new Error('Method not implemented.')
  }
  update(id: number | string, obj: T): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
