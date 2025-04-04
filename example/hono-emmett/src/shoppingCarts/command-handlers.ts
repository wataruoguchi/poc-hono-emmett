import { IllegalStateError } from "@event-driven-io/emmett";
import type {
  AddProductItemToShoppingCart,
  CancelShoppingCart,
  ConfirmShoppingCart,
  RemoveProductItemFromShoppingCart,
} from "./command.ts";
import type {
  ProductItemAddedToShoppingCart,
  ProductItemRemovedFromShoppingCart,
  ShoppingCartCancelled,
  ShoppingCartConfirmed,
} from "./event.ts";
import type { ShoppingCart } from "./state.ts";

export function addProductItem(
  command: AddProductItemToShoppingCart,
  state: ShoppingCart,
): ProductItemAddedToShoppingCart {
  if (state.status === "closed") {
    throw new IllegalStateError("Shopping cart already closed");
  }

  const {
    data: { shoppingCartId, productItem },
    metadata,
  } = command;

  return {
    type: "ProductItemAddedToShoppingCart",
    data: {
      shoppingCartId,
      productItem,
      addedAt: metadata?.now ?? new Date(),
    },
  };
}

export function removeProductItem(
  command: RemoveProductItemFromShoppingCart,
  state: ShoppingCart,
): ProductItemRemovedFromShoppingCart {
  if (state.status !== "opened") {
    throw new IllegalStateError("Shopping cart is not opened");
  }

  const {
    data: { shoppingCartId, productItem },
    metadata,
  } = command;
  const currentQuantity = state.productItems.get(productItem.productId) ?? 0;
  if (currentQuantity < productItem.quantity) {
    throw new IllegalStateError("Not enough products");
  }

  return {
    type: "ProductItemRemovedFromShoppingCart",
    data: {
      shoppingCartId,
      productItem,
      removedAt: metadata?.now ?? new Date(),
    },
  };
}

export function confirmShoppingCart(
  command: ConfirmShoppingCart,
  state: ShoppingCart,
): ShoppingCartConfirmed {
  if (state.status !== "opened") {
    throw new IllegalStateError("Shopping cart is not opened");
  }

  const totalQuantityOfAllProductItems = Array.from(state.productItems.values()).reduce(
    (acc, item) => acc + item,
    0,
  );
  if (totalQuantityOfAllProductItems <= 0) {
    throw new IllegalStateError("Shopping cart is empty");
  }

  const {
    data: { shoppingCartId },
    metadata,
  } = command;

  return {
    type: "ShoppingCartConfirmed",
    data: {
      shoppingCartId,
      confirmedAt: metadata?.now ?? new Date(),
    },
  };
}

export function cancelShoppingCart(
  command: CancelShoppingCart,
  state: ShoppingCart,
): ShoppingCartCancelled {
  if (state.status !== "opened") {
    throw new IllegalStateError("Shopping cart is not opened");
  }

  const {
    data: { shoppingCartId },
    metadata,
  } = command;

  return {
    type: "ShoppingCartCancelled",
    data: { shoppingCartId, cancelledAt: metadata?.now ?? new Date() },
  };
}
