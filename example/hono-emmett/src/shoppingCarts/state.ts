export type EmptyShoppingCart = {
  status: "empty";
};

export type OpenedShoppingCart = {
  status: "opened";
  productItems: ProductItemMap;
};

export type ClosedShoppingCart = {
  status: "closed";
};

export type ShoppingCart = EmptyShoppingCart | OpenedShoppingCart | ClosedShoppingCart;
export type ProductItemMap = Map<string, number>;
