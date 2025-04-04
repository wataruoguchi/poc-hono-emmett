import type { Decider } from "@event-driven-io/emmett";
import type { ShoppingCartCommand } from "./command.ts";
import { decide } from "./decide.ts";
import type { ShoppingCartEvent } from "./event.ts";
import { evolve } from "./evolve.ts";
import type { ShoppingCart } from "./state.ts";

export function initialState(): ShoppingCart {
  return {
    status: "empty",
  };
}

export const decider: Decider<ShoppingCart, ShoppingCartCommand, ShoppingCartEvent> = {
  decide,
  evolve,
  initialState,
};
