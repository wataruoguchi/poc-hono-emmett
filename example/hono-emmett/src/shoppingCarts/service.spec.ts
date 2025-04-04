import { initialState } from "./service.ts";

describe("shoppingCarts service", () => {
  it("should be able to add a product item to the shopping cart", () => {
    const state = initialState();
    expect(state).toEqual({ status: "empty" });
  });
});
