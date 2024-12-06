import { CartsEntity, CartsSchema } from './carts.schema';
import { CategoryEntity, CategorySchema } from './category.schema';
import { OrdersEntity, OrdersSchema } from './orders.schema';
import { PaymentsEntity, PaymentsSchema } from './payments.schema';
import { ProductImagesEntity, ProductImagesSchema } from './productImages.schema';
import { ProductsEntity, ProductsSchema } from './products.schema';
import { StocksEntity, StocksSchema } from './stocks.schema';
import { SuppliersEntity, SuppliersSchema } from './suppliers.schema';
import { SuppliersOrdersEntity, SuppliersOrdersSchema } from './suppliersOrders.schema';
import { UsersEntity, UsersSchema } from './users.schema';
import { UsersProfilesEntity, UsersProfilesSchema } from './usersProfiles.schema';

// export all schemas
export { UsersSchema as UsersSchema, UsersEntity }
export { ProductsSchema as ProductsSchema, ProductsEntity }
export { CartsSchema as CartsSchema, CartsEntity }
export { PaymentsSchema as PaymentsSchema, PaymentsEntity }
export { StocksSchema as StocksSchema, StocksEntity }
export { CategorySchema as CategorySchema, CategoryEntity }
export { ProductImagesSchema as ProductImagesSchema, ProductImagesEntity }
export { SuppliersSchema as SuppliersSchema, SuppliersEntity }
export { OrdersSchema as OrdersSchema, OrdersEntity }
export { UsersProfilesSchema as UsersProfilesSchema, UsersProfilesEntity }
export { SuppliersOrdersSchema as SuppliersOrdersSchema, SuppliersOrdersEntity }


// export schema
export const schema = {
    users: UsersSchema,
    products: ProductsSchema,
    carts: CartsSchema,
    payments: PaymentsSchema,
    stocks: StocksSchema,
    category: CategorySchema,
    productImages: ProductImagesSchema,
    suppliers: SuppliersSchema,
    orders: OrdersSchema,
    usersProfiles: UsersProfilesSchema,
    suppliersOrders: SuppliersOrdersSchema
}