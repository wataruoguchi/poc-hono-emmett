import { Hono } from "hono";
import { shoppingCartsApi } from "./api.ts";

describe("ShoppingCartsApi", () => {
  const app = new Hono();
  shoppingCartsApi(app);

  describe("POST /clients/:clientId/product-items/", async () => {
    it("should create a product item", async () => {
      const response = await app.request("/clients/1/product-items/", {
        method: "POST",
        body: JSON.stringify({ productId: "1", quantity: 1 }),
      });
      expect(response.status).toBe(200);
    });
  });
});
