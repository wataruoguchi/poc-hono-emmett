import type {
  ProductItemAddedToShoppingCart,
  ProductItemRemovedFromShoppingCart,
  ShoppingCartCancelled,
  ShoppingCartConfirmed,
} from "./event.ts";
import { evolve } from "./evolve.ts";
import type { ClosedShoppingCart, EmptyShoppingCart, OpenedShoppingCart } from "./state.ts";

describe("evolve.ts#evolve", () => {
  const shoppingCartId = Math.random().toString();
  const productId = Math.random().toString();

  describe("when the event type is ProductItemAddedToShoppingCart", () => {
    const event = {
      type: "ProductItemAddedToShoppingCart",
      data: {
        shoppingCartId,
        productItem: {
          productId,
          quantity: 1,
        },
        addedAt: new Date(),
      },
    } as ProductItemAddedToShoppingCart;

    describe("when the shopping cart is empty", () => {
      const state = { status: "empty" } as EmptyShoppingCart;

      it("should evolve the state", () => {
        const newState = evolve(state, event);
        expect(newState).not.toEqual(state);
        expect(newState).toEqual({ status: "opened", productItems: new Map([[productId, 1]]) });
      });
    });

    describe("when the shopping cart is opened", () => {
      const state = {
        status: "opened",
        productItems: new Map([[productId, 1]]),
      } as OpenedShoppingCart;

      it("should evolve the state", () => {
        const newState = evolve(state, event);
        expect(newState).not.toEqual(state);
        expect(newState).toEqual({ status: "opened", productItems: new Map([[productId, 2]]) });
      });
    });

    describe("when the shopping cart is closed", () => {
      const state = { status: "closed" } as ClosedShoppingCart;

      it("should evolve the state", () => {
        const newState = evolve(state, event);
        expect(newState).toEqual(state);
      });
    });
  });

  describe("when the event type is ProductItemRemovedFromShoppingCart", () => {
    const event = {
      type: "ProductItemRemovedFromShoppingCart",
      data: {
        shoppingCartId,
        productItem: {
          productId,
          quantity: 1,
        },
        removedAt: new Date(),
      },
    } as ProductItemRemovedFromShoppingCart;

    describe("when the shopping cart is empty", () => {
      const state = { status: "empty" } as EmptyShoppingCart;

      it("should evolve the state", () => {
        const newState = evolve(state, event);
        expect(newState).not.toEqual(state);
        expect(newState).toEqual({ status: "opened", productItems: new Map([[productId, -1]]) });
      });
    });

    describe("when the shopping cart is opened", () => {
      const state = {
        status: "opened",
        productItems: new Map([[productId, 1]]),
      } as OpenedShoppingCart;

      it("should evolve the state", () => {
        const newState = evolve(state, event);
        expect(newState).not.toEqual(state);
        expect(newState).toEqual({ status: "opened", productItems: new Map([[productId, 0]]) });
      });
    });

    describe("when the shopping cart is closed", () => {
      const state = { status: "closed" } as ClosedShoppingCart;

      it("should NOT evolve the state", () => {
        const newState = evolve(state, event);
        expect(newState).toEqual(state);
      });
    });
  });

  describe("when the event type is ShoppingCartConfirmed", () => {
    const event = {
      type: "ShoppingCartConfirmed",
      data: {
        shoppingCartId,
        confirmedAt: new Date(),
      },
    } as ShoppingCartConfirmed;

    const state = { status: "empty" } as EmptyShoppingCart;

    it("should evolve the state", () => {
      const newState = evolve(state, event);
      expect(newState).toEqual({ status: "closed" });
    });
  });

  describe("when the event type is ShoppingCartCancelled", () => {
    const event = {
      type: "ShoppingCartCancelled",
      data: {
        shoppingCartId,
        cancelledAt: new Date(),
      },
    } as ShoppingCartCancelled;

    const state = { status: "empty" } as EmptyShoppingCart;

    it("should evolve the state", () => {
      const newState = evolve(state, event);
      expect(newState).toEqual({ status: "closed" });
    });
  });
});
