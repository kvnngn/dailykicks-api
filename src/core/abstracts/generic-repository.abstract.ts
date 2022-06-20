export abstract class IGenericRepository<T> {
  abstract create(data: T | any): Promise<T>;
  abstract findOneById(id: number): Promise<T>;
  abstract findByCondition(filterCondition: any): Promise<T>;
  abstract findWithRelations(relations: any): Promise<T[]>;
  abstract findAll(): Promise<T[]>;
  abstract remove(id: string): Promise<boolean>;
}
