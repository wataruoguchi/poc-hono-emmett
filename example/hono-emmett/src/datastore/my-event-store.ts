import { createEventStore, type AppendToStream, type ReadStream } from "emmett-event-store-adaptor";

const readStream: ReadStream = async function readStream(streamName, options) {
  console.log("My readStream", streamName, options);
  return Promise.resolve({
    events: [],
    currentStreamVersion: 0n,
    streamExists: false,
  });
};

const appendToStream: AppendToStream = async function appendToStream(streamName, events, options) {
  console.log("My appendToStream", streamName, events, options);
  return Promise.resolve({
    lastEventGlobalPosition: 0n,
    nextExpectedStreamVersion: 0n,
    createdNewStream: false,
  });
};

export const eventStore = createEventStore({
  readStream,
  appendToStream,
});
