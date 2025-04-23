import { DeciderCommandHandler } from "@event-driven-io/emmett";
import type { Context, Hono } from "hono";
import { eventStore } from "../datastore/my-event-store.ts";
import { decider } from "./service.ts";

export function shoppingCartsApi(app: Hono) {
  const handle = DeciderCommandHandler(decider);
  /**
   * It creates the following tables:
   * - emt_global_message_position
   * - emt_messages
   * - emt_messages_emt_default
   * - emt_messages_emt_default_active
   * - emt_messages_emt_default_archived
   * - emt_streams
   * - emt_streams_emt_default
   * - emt_streams_emt_default_active
   * - emt_streams_emt_default_archived
   * - emt_subscriptions
   * - emt_subscriptions_emt_default
   */

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
