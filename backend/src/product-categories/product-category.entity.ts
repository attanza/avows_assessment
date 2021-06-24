import BaseIdEntity from 'src/database/base-id.entity';
import Product from 'src/products/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('product_categories')
class ProductCategory extends BaseIdEntity {
  @Column({ unique: true })
  public name: string;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];
}

export default ProductCategory;
