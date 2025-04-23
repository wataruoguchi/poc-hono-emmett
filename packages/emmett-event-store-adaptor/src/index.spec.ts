import type { Event } from "@event-driven-io/emmett";
import { createEventStore, createdNewStream } from "./index";

interface TestEvent extends Event {
  data: {
    value: number;
  };
}

describe("createEventStore", () => {
  it("should create an event store with expected methods", () => {
    const mockReadStream = vi.fn();
    const mockAppendToStream = vi.fn();

    const eventStore = createEventStore({
      readStream: mockReadStream,
      appendToStream: mockAppendToStream,
    });

    expect(eventStore).toHaveProperty("aggregateStream");
    expect(eventStore).toHaveProperty("readStream");
    expect(eventStore).toHaveProperty("appendToStream");
  });

  describe("aggregateStream", () => {
    const initialState = () => 0;
    const evolve = (state: number, event: TestEvent) => state + event.data.value;

    describe("when stream exists", () => {
      let eventStore: ReturnType<typeof createEventStore>;

      beforeEach(() => {
        const mockEvents: TestEvent[] = [
          { type: "TestEvent", data: { value: 1 } },
          { type: "TestEvent", data: { value: 2 } },
          { type: "TestEvent", data: { value: 3 } },
        ];

        const mockReadStream = vi.fn().mockResolvedValue({
          events: mockEvents,
          currentStreamVersion: 3n,
          streamExists: true,
        });

        const mockAppendToStream = vi.fn();

        eventStore = createEventStore({
          readStream: mockReadStream,
          appendToStream: mockAppendToStream,
        });
      });

      it("should aggregate stream events correctly", async () => {
        await expect(
          eventStore.aggregateStream("test-stream", {
            initialState,
            evolve,
          }),
        ).resolves.toEqual({
          state: 6,
          currentStreamVersion: 3n,
          streamExists: true,
        });
      });
    });

    describe("when stream is empty", () => {
      let eventStore: ReturnType<typeof createEventStore>;

      beforeEach(() => {
        const mockReadStream = vi.fn().mockResolvedValue({
          events: [],
          currentStreamVersion: 0n,
          streamExists: false,
        });

        const mockAppendToStream = vi.fn();

        eventStore = createEventStore({
          readStream: mockReadStream,
          appendToStream: mockAppendToStream,
        });
      });

      it("should handle empty stream correctly", async () => {
        await expect(
          eventStore.aggregateStream("test-stream", {
            initialState,
            evolve,
          }),
        ).resolves.toEqual({
          state: 0,
          currentStreamVersion: 0n,
          streamExists: false,
        });
      });
    });
  });
});

describe("createdNewStream", () => {
  const events: TestEvent[] = [
    { type: "TestEvent", data: { value: 1 } },
    { type: "TestEvent", data: { value: 2 } },
  ];

  describe("when next stream position is equal to events length", () => {
    it("should return true", () => {
      expect(createdNewStream(2n, events)).toBe(true);
    });
  });

  describe("when next stream position is greater than events length", () => {
    it("should return true", () => {
      expect(createdNewStream(3n, events)).toBe(true);
    });
  });

  describe("when next stream position is less than events length", () => {
    it("should return false", () => {
      expect(createdNewStream(1n, events)).toBe(false);
      expect(createdNewStream(0n, events)).toBe(false);
    });
  });
});
