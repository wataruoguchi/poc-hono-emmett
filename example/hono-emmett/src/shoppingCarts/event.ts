import type { Event } from "@event-driven-io/emmett";
import type { ProductItem } from "./entities.ts";

export type ProductItemAddedToShoppingCart = Event<
  "ProductItemAddedToShoppingCart",
  {
    shoppingCartId: string;
    productItem: ProductItem;
    addedAt: Date;
  }
>;

export type ProductItemRemovedFromShoppingCart = Event<
  "ProductItemRemovedFromShoppingCart",
  {
    shoppingCartId: string;
    productItem: ProductItem;
    removedAt: Date;
  }
>;

export type ShoppingCartConfirmed = Event<
  "ShoppingCartConfirmed",
  {
    shoppingCartId: string;
    confirmedAt: Date;
  }
>;

export type ShoppingCartCancelled = Event<
  "ShoppingCartCancelled",
  {
    shoppingCartId: string;
    cancelledAt: Date;
  }
>;

export type ShoppingCartEvent =
  | ProductItemAddedToShoppingCart
  | ProductItemRemovedFromShoppingCart
  | ShoppingCartConfirmed
  | ShoppingCartCancelled;
