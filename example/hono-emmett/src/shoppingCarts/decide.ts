import { EmmettError } from "@event-driven-io/emmett";
import {
  addProductItem,
  cancelShoppingCart,
  confirmShoppingCart,
  removeProductItem,
} from "./command-handlers.ts";
import type { ShoppingCartCommand } from "./command.ts";
import type { ShoppingCartEvent } from "./event.ts";
import type { ShoppingCart } from "./state.ts";

export type CommandHandlers = {
  addProductItem: typeof addProductItem;
  removeProductItem: typeof removeProductItem;
  confirmShoppingCart: typeof confirmShoppingCart;
  cancelShoppingCart: typeof cancelShoppingCart;
};

export function createDecide(
  handlers: CommandHandlers = {
    addProductItem,
    removeProductItem,
    confirmShoppingCart,
    cancelShoppingCart,
  },
) {
  return (command: ShoppingCartCommand, state: ShoppingCart): ShoppingCartEvent => {
    const { type } = command;
    switch (type) {
      case "AddProductItemToShoppingCart":
        return handlers.addProductItem(command, state);
      case "RemoveProductItemFromShoppingCart":
        return handlers.removeProductItem(command, state);
      case "ConfirmShoppingCart":
        return handlers.confirmShoppingCart(command, state);
      case "CancelShoppingCart":
        return handlers.cancelShoppingCart(command, state);
      default: {
        const _notExistingCommandType: never = type;
        throw new EmmettError("Unknown command type");
      }
    }
  };
}

export const decide = createDecide();
