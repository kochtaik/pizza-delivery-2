export abstract class AbstractRepositoryMock<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  async create(): Promise<T> {
    return this.entityStub;
  }

  async findOne(): Promise<T> {
    return this.entityStub;
  }

  async findOneById(): Promise<T> {
    return this.entityStub;
  }

  async findOneandUpdate(): Promise<T> {
    return this.entityStub;
  }

  async deleteOne(): Promise<{ deletedCount: number; acknowledged: boolean }> {
    return { deletedCount: 1, acknowledged: true };
  }

  async upsert(): Promise<T> {
    return this.entityStub;
  }

  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async insertMany(): Promise<T[]> {
    return [this.entityStub];
  }

  async paginate(): Promise<{
    items: T[];
    pagination: { totalItems: number; totalPages: number; page: number };
  }> {
    return {
      items: [this.entityStub],
      pagination: {
        totalItems: 10,
        totalPages: 5,
        page: 1,
      },
    };
  }
}
