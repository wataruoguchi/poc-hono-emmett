import { Hono } from "hono";
import { shoppingCartsApi } from "./shoppingCarts/api.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

shoppingCartsApi(app);

export { app };
