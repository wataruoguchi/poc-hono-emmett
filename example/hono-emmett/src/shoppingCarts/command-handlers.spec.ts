import { IllegalStateError } from "@event-driven-io/emmett";
import {
  addProductItem,
  cancelShoppingCart,
  confirmShoppingCart,
  removeProductItem,
} from "./command-handlers.ts";
import type {
  AddProductItemToShoppingCart,
  CancelShoppingCart,
  ConfirmShoppingCart,
  RemoveProductItemFromShoppingCart,
} from "./command.ts";
import type { ShoppingCartEvent } from "./event.ts";
import type { ClosedShoppingCart, EmptyShoppingCart, OpenedShoppingCart } from "./state.ts";

describe("command-handlers.ts", () => {
  describe("addProductItem", () => {
    const productId = Math.random().toString();
    const command = {
      type: "AddProductItemToShoppingCart",
      data: {
        shoppingCartId: "1",
        productItem: {
          productId,
          quantity: 1,
        },
      },
    } as AddProductItemToShoppingCart;

    describe("when the shopping cart is empty", () => {
      let event: ShoppingCartEvent;
      beforeEach(() => {
        const state = { status: "empty" } as EmptyShoppingCart;
        event = addProductItem(command, state);
      });

      it("should add a product item to the shopping cart", () => {
        expect(event).toEqual({
          type: "ProductItemAddedToShoppingCart",
          data: {
            shoppingCartId: "1",
            productItem: { productId, quantity: 1 },
            addedAt: expect.any(Date),
          },
        });
      });
    });

    describe("when the shopping cart is closed", () => {
      it("should NOT add a product item to the shopping cart", () => {
        expect(() => addProductItem(command, { status: "closed" } as ClosedShoppingCart)).toThrow(
          IllegalStateError,
        );
      });
    });
  });

  describe("removeProductItem", () => {
    const productId = Math.random().toString();
    const command = {
      type: "RemoveProductItemFromShoppingCart",
      data: {
        shoppingCartId: "1",
        productItem: {
          productId,
          quantity: 1,
        },
      },
    } as RemoveProductItemFromShoppingCart;

    describe("when the shopping cart is opened", () => {
      let event: ShoppingCartEvent;

      describe("when the product item is in the shopping cart", () => {
        beforeEach(() => {
          const state = {
            status: "opened",
            productItems: new Map([[productId, 1]]),
          } as OpenedShoppingCart;
          event = removeProductItem(command, state);
        });

        it("should remove a product item from the shopping cart", () => {
          expect(event).toEqual({
            type: "ProductItemRemovedFromShoppingCart",
            data: {
              shoppingCartId: "1",
              productItem: { productId, quantity: 1 },
              removedAt: expect.any(Date),
            },
          });
        });
      });

      describe("when the product item is not in the shopping cart", () => {
        it("should NOT remove a product item from the shopping cart", () => {
          const state = {
            status: "opened",
            productItems: new Map([[productId, 0]]),
          } as OpenedShoppingCart;
          expect(() => removeProductItem(command, state)).toThrow(IllegalStateError);
        });
      });
    });

    describe("when the shopping cart is closed", () => {
      it("should NOT add a product item to the shopping cart", () => {
        expect(() =>
          removeProductItem(command, { status: "closed" } as ClosedShoppingCart),
        ).toThrow(IllegalStateError);
      });
    });
  });

  describe("confirmShoppingCart", () => {
    const productId = Math.random().toString();
    const command = {
      type: "ConfirmShoppingCart",
      data: {
        shoppingCartId: "1",
      },
    } as ConfirmShoppingCart;

    describe("when the shopping cart is opened", () => {
      let event: ShoppingCartEvent;

      describe("when the product item is in the shopping cart", () => {
        beforeEach(() => {
          const state = {
            status: "opened",
            productItems: new Map([[productId, 1]]),
          } as OpenedShoppingCart;
          event = confirmShoppingCart(command, state);
        });

        it("should confirm the shopping cart", () => {
          expect(event).toEqual({
            type: "ShoppingCartConfirmed",
            data: {
              shoppingCartId: "1",
              confirmedAt: expect.any(Date),
            },
          });
        });
      });

      describe("when the product item is not in the shopping cart", () => {
        it("should NOT remove a product item from the shopping cart", () => {
          const state = {
            status: "opened",
            productItems: new Map([[productId, 0]]),
          } as OpenedShoppingCart;
          expect(() => confirmShoppingCart(command, state)).toThrow(IllegalStateError);
        });
      });
    });

    describe("when the shopping cart is closed", () => {
      it("should NOT confirm the shopping cart", () => {
        expect(() =>
          confirmShoppingCart(command, { status: "closed" } as ClosedShoppingCart),
        ).toThrow(IllegalStateError);
      });
    });
  });

  describe("cancelShoppingCart", () => {
    const productId = Math.random().toString();
    const command = {
      type: "CancelShoppingCart",
      data: {
        shoppingCartId: "1",
      },
    } as CancelShoppingCart;

    describe("when the shopping cart is opened", () => {
      let event: ShoppingCartEvent;

      describe("when the product item is in the shopping cart", () => {
        beforeEach(() => {
          const state = {
            status: "opened",
            productItems: new Map([[productId, 1]]),
          } as OpenedShoppingCart;
          event = cancelShoppingCart(command, state);
        });

        it("should cancel the shopping cart", () => {
          expect(event).toEqual({
            type: "ShoppingCartCancelled",
            data: {
              shoppingCartId: "1",
              cancelledAt: expect.any(Date),
            },
          });
        });
      });
    });

    describe("when the shopping cart is closed", () => {
      it("should NOT cancel the shopping cart", () => {
        expect(() =>
          cancelShoppingCart(command, { status: "closed" } as ClosedShoppingCart),
        ).toThrow(IllegalStateError);
      });
    });
  });
});
