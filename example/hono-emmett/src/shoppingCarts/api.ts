import { DeciderCommandHandler } from "@event-driven-io/emmett";
import { getPostgreSQLEventStore } from "@event-driven-io/emmett-postgresql";
import type { Context, Hono } from "hono";
import { decider } from "./service.ts";

const connectionString = "postgresql://localhost:5432/postgres";
const eventStore = getPostgreSQLEventStore(connectionString);

export function shoppingCartsApi(app: Hono) {
  // What does this do? How does it store the data into the db?
  const handle = DeciderCommandHandler(decider);

  app.get("/shopping-carts", (c: Context) => {
    return c.text("Hello Hono!");
  });

  // Open a shopping cart. Technically, this is the same as adding a product item to the shopping cart.
  app.post("/clients/:clientId/product-items/", async (c: Context) => {
    // TODO Validate input
    const clientId = c.req.param("clientId");
    // TODO Validate input
    const { productId, quantity } = await c.req.json();
    const shoppingCartId = clientId;
    try {
      const result = await handle(eventStore, shoppingCartId, {
        type: "AddProductItemToShoppingCart",
        data: {
          shoppingCartId,
          productItem: {
            productId,
            quantity,
          },
        },
      });
      console.log(result); // TODO Remove
      return c.json({
        shoppingCartId,
        status: "opened",
      });
    } catch (error) {
      // TODO Distinguish between business and technical errors
      return c.json(
        {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500,
      );
    }
  });
}
