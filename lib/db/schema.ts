import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------------------
// 1) CUSTOMERS TABLE
// Mirrors old "customer.py"
// ---------------------------
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  billingInfo: jsonb('billing_info'),
  usageTokens: integer('usage_tokens').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

// ---------------------------
// 2) USERS TABLE
// Mirrors old "user.py"
// ---------------------------
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  // Reference the 'customers' table
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

// ---------------------------
// 3) CHATBOTS TABLE
// Mirrors old "chatbot.py"
// ---------------------------
export const chatbots = pgTable('chatbots', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Reference the 'customers' table
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  apiKey: varchar('api_key', { length: 255 }),
  demoMessageCount: integer('demo_message_count').default(0),
});

// ---------------------------
// 4) DOCUMENTS TABLE
// Mirrors old "document.py"
// ---------------------------
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Reference the 'chatbots' table
  chatbotId: uuid('chatbot_id')
    .notNull()
    .references(() => chatbots.id, { onDelete: 'cascade' }),
  filename: varchar('filename', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 255 }).notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow(),
  fileType: varchar('file_type', { length: 50 }),
  metadataJson: jsonb('metadata_json'),
});

// ---------------------------
// 5) CHAT HISTORY TABLE
// Mirrors old "chat_history.py"
// ---------------------------
export const chatHistory = pgTable('chat_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Chatbot foreign key
  chatbotId: uuid('chatbot_id')
    .notNull()
    .references(() => chatbots.id, { onDelete: 'cascade' }),
  // Optionally user foreign key (can be null)
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow(),
  inputTokens: integer('input_tokens'),
  outputTokens: integer('output_tokens'),
  sourceDocs: text('source_docs'),
});

// ---------------------------
// 6) BILLING TABLE
// Mirrors old "billing.py"
// ---------------------------
export const billing = pgTable('billing', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  invoiceNumber: varchar('invoice_number', { length: 255 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow(),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
});

// ---------------------------
// 7) USAGE TOKENS TABLE
// Mirrors old "usage_token.py"
// ---------------------------
export const usageTokens = pgTable('usage_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  tokensUsed: integer('tokens_used').default(0),
  tokensRemaining: integer('tokens_remaining').default(0),
  inputTokensUsed: integer('input_tokens_used').default(0),
  outputTokensUsed: integer('output_tokens_used').default(0),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow(),
});

// ---------------------------
// 8) DEMO USAGE TABLE
// Mirrors old "demo_usage.py"
// ---------------------------
export const demoUsage = pgTable('demo_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chatbotId: uuid('chatbot_id')
    .notNull()
    .references(() => chatbots.id, { onDelete: 'cascade' }),
  messageCount: integer('message_count').default(0),
});

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey(),
  userId: integer('user_id'),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

/**
 * Optionally, define relationships via `relations(...)`
 * if you'd like to use Drizzle's relational helpers.
 * Example:
 *
 * export const customersRelations = relations(customers, ({ many }) => ({
 *   users: many(users),
 *   chatbots: many(chatbots),
 *   billingRecords: many(billing),
 *   usage: many(usageTokens),
 * }));
 *
 * export const chatbotsRelations = relations(chatbots, ({ many, one }) => ({
 *   documents: many(documents),
 *   chatHistory: many(chatHistory),
 *   customer: one(customers, {
 *     fields: [chatbots.customerId],
 *     references: [customers.id],
 *   }),
 * }));
 *
 * ... etc.
 */