import type { Command } from "@event-driven-io/emmett";
import type { ProductItem } from "./entities.ts";

export type AddProductItemToShoppingCart = Command<
  "AddProductItemToShoppingCart",
  {
    shoppingCartId: string;
    productItem: ProductItem;
  }
>;

export type RemoveProductItemFromShoppingCart = Command<
  "RemoveProductItemFromShoppingCart",
  {
    shoppingCartId: string;
    productItem: ProductItem;
  }
>;

export type ConfirmShoppingCart = Command<
  "ConfirmShoppingCart",
  {
    shoppingCartId: string;
  }
>;

export type CancelShoppingCart = Command<
  "CancelShoppingCart",
  {
    shoppingCartId: string;
  }
>;

export type ShoppingCartCommand =
  | AddProductItemToShoppingCart
  | RemoveProductItemFromShoppingCart
  | ConfirmShoppingCart
  | CancelShoppingCart;
