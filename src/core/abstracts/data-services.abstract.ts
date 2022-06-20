import { Profile, Warehouse } from "../entities";
import { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
  abstract profiles: IGenericRepository<Profile>;
  abstract warehouses: IGenericRepository<Warehouse>;
}
