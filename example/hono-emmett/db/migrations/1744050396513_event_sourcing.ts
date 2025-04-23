import { sql, type Kysely } from "kysely";

/**
 * TODO: Create tables for event sourcing.
 *
 * - Global position (sequential table)
 * - Messages (event store)
 * - Streams (stream store)
 * - Subscriptions (What is this?)
 *
 * TODO: Build the APIs: `readStream`, `appendToStream`, and `aggregateStream`.
 * TODO: Build the module that let us self-manage the DB schema.
 */

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  /**
   * messages: Stores the actual events. The global_position supports projections that scan the entire event stream. It has `message_data`.
   * streams: Tracks metadata per stream to aggregate events. It does not have `message_data`.
   * subscriptions: Tracks of how far a subscriber has processed the event stream.
   */

  // Create streams table
  await db.schema
    .createTable("wtr_streams")
    .addColumn("stream_id", "text", (col) => col.notNull())
    .addColumn("stream_position", "bigint", (col) => col.notNull())
    .addColumn("partition", "text", (col) => col.notNull().defaultTo("global"))
    .addColumn("stream_type", "text", (col) => col.notNull())
    .addColumn("stream_metadata", "jsonb", (col) => col.notNull())
    .addColumn("is_archived", "boolean", (col) => col.notNull().defaultTo(false))
    .addPrimaryKeyConstraint("streams_pk", [
      "stream_id",
      "stream_position",
      "partition",
      "is_archived",
    ])
    .addUniqueConstraint("streams_unique", ["stream_id", "partition", "is_archived"])
    .execute();

  // Create messages table
  await db.schema
    .createTable("wtr_messages")
    .addColumn("stream_id", "text", (col) => col.notNull())
    .addColumn("stream_position", "bigint", (col) => col.notNull())
    .addColumn("partition", "text", (col) => col.notNull().defaultTo("global"))
    .addColumn("message_kind", "char(1)", (col) => col.notNull().defaultTo("E"))
    .addColumn("message_data", "jsonb", (col) => col.notNull())
    .addColumn("message_metadata", "jsonb", (col) => col.notNull())
    .addColumn("message_schema_version", "text", (col) => col.notNull())
    .addColumn("message_type", "text", (col) => col.notNull())
    .addColumn("message_id", "text", (col) => col.notNull())
    .addColumn("is_archived", "boolean", (col) => col.notNull().defaultTo(false))
    .addColumn("global_position", "bigint", (col) =>
      col.defaultTo(sql`nextval('wtr_global_message_position')`),
    )
    .addColumn("transaction_id", "bigint", (col) => col.notNull())
    .addColumn("created", "timestamptz", (col) => col.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint("messages_pk", [
      "stream_id",
      "stream_position",
      "partition",
      "is_archived",
    ])
    .execute();

  // Create subscriptions table
  await db.schema
    .createTable("wtr_subscriptions")
    .addColumn("subscription_id", "text", (col) => col.notNull())
    .addColumn("version", "integer", (col) => col.notNull().defaultTo(1))
    .addColumn("partition", "text", (col) => col.notNull().defaultTo("global"))
    .addColumn("last_processed_position", "bigint", (col) => col.notNull())
    .addColumn("last_processed_transaction_id", "bigint", (col) => col.notNull())
    .addPrimaryKeyConstraint("subscriptions_pk", ["subscription_id", "partition", "version"])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("wtr_streams").execute();
  await db.schema.dropTable("wtr_messages").execute();
  await db.schema.dropTable("wtr_subscriptions").execute();
}
