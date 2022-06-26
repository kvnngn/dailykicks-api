import { Brand } from "./brand.entity";
import { BrandModel } from "./brandModel.entity";
import { Profile } from "./profile.entity";

export class Product {
  name: string;
  image_url: string;
  colors: string[];
  price: number;
  brand: Brand;
  model: BrandModel;
  createdBy: Profile;
  createdAt: Date;
  updatedAt: Date;
}
