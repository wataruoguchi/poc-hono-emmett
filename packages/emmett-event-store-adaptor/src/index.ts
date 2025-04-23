import {
  assertExpectedVersionMatchesCurrent,
  type AggregateStreamOptions,
  type AggregateStreamResult,
  type AppendToStreamOptions,
  type AppendToStreamResultWithGlobalPosition,
  type Event,
  type ReadEventMetadataWithGlobalPosition,
  type ReadStreamOptions,
  type ReadStreamResult,
} from "@event-driven-io/emmett";

type PostgresReadEventMetadata = ReadEventMetadataWithGlobalPosition;
const PostgreSQLEventStoreDefaultStreamVersion = 0n;

export type ReadStream = <EventType extends Event>(
  stream: string,
  options?: ReadStreamOptions,
) => Promise<ReadStreamResult<EventType, PostgresReadEventMetadata>>;

export type AppendToStream = <EventType extends Event>(
  streamName: string,
  events: EventType[],
  options?: AppendToStreamOptions,
) => Promise<AppendToStreamResultWithGlobalPosition>;

export function createEventStore({
  readStream,
  appendToStream,
}: { readStream: ReadStream; appendToStream: AppendToStream }) {
  /**
   * This function is pretty much a copy of the emmett aggregateStream function found in `src/packages/emmett-postgresql/src/eventStore/postgreSQLEventStore.ts`
   */
  async function aggregateStream<State, EventType extends Event>(
    streamName: string,
    options: AggregateStreamOptions<State, EventType, PostgresReadEventMetadata>,
  ): Promise<AggregateStreamResult<State>> {
    const { evolve, initialState, read } = options;

    const expectedStreamVersion = read?.expectedStreamVersion;

    const result = await readStream<EventType>(streamName, options.read);
    assertExpectedVersionMatchesCurrent(
      result.currentStreamVersion,
      expectedStreamVersion,
      PostgreSQLEventStoreDefaultStreamVersion,
    );

    const state = result.events.reduce(
      (state, event) => (event ? evolve(state, event) : state),
      initialState(),
    );

    return {
      state,
      currentStreamVersion: result.currentStreamVersion,
      streamExists: result.streamExists,
    };
  }

  return {
    aggregateStream,
    readStream,
    appendToStream,
  };
}

/**
 * TODO: I don't know how we want to consume the return value of this function.
 */
export function createdNewStream<EventType extends Event>(
  nextStreamPosition: bigint,
  events: EventType[],
) {
  return nextStreamPosition >= BigInt(events.length);
}
