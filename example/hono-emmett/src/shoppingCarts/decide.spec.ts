import { EmmettError } from "@event-driven-io/emmett";
import type {
  AddProductItemToShoppingCart,
  CancelShoppingCart,
  ConfirmShoppingCart,
  RemoveProductItemFromShoppingCart,
  ShoppingCartCommand,
} from "./command.ts";
import { type CommandHandlers, createDecide } from "./decide.ts";
import type { EmptyShoppingCart } from "./state.ts";

describe("decide.ts#decide", () => {
  const addProductItemSpy = vi.fn();
  const removeProductItemSpy = vi.fn();
  const confirmShoppingCartSpy = vi.fn();
  const cancelShoppingCartSpy = vi.fn();
  const decide = createDecide({
    addProductItem: addProductItemSpy,
    removeProductItem: removeProductItemSpy,
    confirmShoppingCart: confirmShoppingCartSpy,
    cancelShoppingCart: cancelShoppingCartSpy,
  } as unknown as CommandHandlers);

  describe("when handling an AddProductItemToShoppingCart command", () => {
    it("should call the addProductItem command handler", () => {
      const command = { type: "AddProductItemToShoppingCart" } as AddProductItemToShoppingCart;
      const state = { status: "empty" } as EmptyShoppingCart;
      decide(command, state);
      expect(addProductItemSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handling an RemoveProductItemFromShoppingCart command", () => {
    it("should call the removeProductItem command handler", () => {
      const command = {
        type: "RemoveProductItemFromShoppingCart",
      } as RemoveProductItemFromShoppingCart;
      const state = { status: "empty" } as EmptyShoppingCart;
      decide(command, state);
      expect(removeProductItemSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handling an ConfirmShoppingCart command", () => {
    it("should call the confirmShoppingCart command handler", () => {
      const command = { type: "ConfirmShoppingCart" } as ConfirmShoppingCart;
      const state = { status: "empty" } as EmptyShoppingCart;
      decide(command, state);
      expect(confirmShoppingCartSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handling an CancelShoppingCart command", () => {
    it("should call the cancelShoppingCart command handler", () => {
      const command = { type: "CancelShoppingCart" } as CancelShoppingCart;
      const state = { status: "empty" } as EmptyShoppingCart;
      decide(command, state);
      expect(cancelShoppingCartSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handling an unknown command", () => {
    it("should throw an error", () => {
      const command = { type: "UnknownCommand" } as unknown;
      const state = { status: "empty" } as EmptyShoppingCart;
      expect(() => decide(command as ShoppingCartCommand, state)).toThrow(EmmettError);
    });
  });
});
