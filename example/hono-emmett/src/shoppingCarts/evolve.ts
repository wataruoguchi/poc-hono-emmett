import type { ShoppingCartEvent } from "./event.ts";
import type { ProductItemMap, ShoppingCart } from "./state.ts";

export function evolve(state: ShoppingCart, event: ShoppingCartEvent): ShoppingCart {
  const { type, data } = event;

  switch (type) {
    case "ProductItemAddedToShoppingCart":
    case "ProductItemRemovedFromShoppingCart": {
      if (state.status !== "opened" && state.status !== "empty") return state;
      const {
        productItem: { productId, quantity },
      } = data;
      const productItems =
        state.status === "opened" ? state.productItems : new Map<string, number>();
      const plusOrMinus = type === "ProductItemAddedToShoppingCart" ? 1 : -1;

      return {
        status: "opened",
        productItems: withUpdatedQuantity(productItems, productId, plusOrMinus * quantity),
      };
    }
    case "ShoppingCartConfirmed":
    case "ShoppingCartCancelled":
      return {
        status: "closed",
      };
    default:
      return state;
  }
}

function withUpdatedQuantity(current: ProductItemMap, productId: string, quantity: number) {
  const productItems = new Map(current);
  const currentQuantity = productItems.get(productId) ?? 0;

  productItems.set(productId, currentQuantity + quantity);

  return productItems;
}
