import { db } from './drizzle'; // Your Drizzle client
import {
  customers,
  users,
  chatbots,
  documents,
  chatHistory,
  billing,
  usageTokens,
  demoUsage,
} from './schema'; // Your old-model-based schema
import { hashPassword } from '@/lib/auth/session'; // Or wherever your hash utility is

async function seed() {
  console.log('Starting seed process...');

  // 1) Create a sample Customer
  const [acmeCustomer] = await db
    .insert(customers)
    .values({
      name: 'Acme Inc',
      contactEmail: 'admin@acme.co',
      billingInfo: null, // or a JSON object if you want { address: "..." }
      usageTokens: 2000, // optional initial usage
    })
    .returning();

  console.log('Created customer:', acmeCustomer);

  // 2) Create a sample User belonging to that Customer
  //    Replace this with your own password / hash function
  const hashedPassword = await hashPassword('admin123');
  const [adminUser] = await db
    .insert(users)
    .values({
      username: 'acme_admin',
      passwordHash: hashedPassword,
      customerId: acmeCustomer.id,
    })
    .returning();

  console.log('Created user:', adminUser);

  // 3) Create a sample Chatbot
  const [bot1] = await db
    .insert(chatbots)
    .values({
      customerId: acmeCustomer.id,
      name: 'Main Chatbot',
      description: 'A sample chatbot for demonstration',
      apiKey: 'random-api-key-here',
    })
    .returning();

  console.log('Created chatbot:', bot1);

  // 4) Optionally, create usage tokens record (if you want to track usage separately)
  const [usageRec] = await db
    .insert(usageTokens)
    .values({
      customerId: acmeCustomer.id,
      tokensUsed: 0,
      tokensRemaining: 2000, // match the initial usageTokens in `customers`, or treat them separately
      inputTokensUsed: 0,
      outputTokensUsed: 0,
    })
    .returning();

  console.log('Created usage tokens record:', usageRec);

  // 5) Optionally, insert a sample Document
  const [doc1] = await db
    .insert(documents)
    .values({
      chatbotId: bot1.id,
      filename: 'Welcome.pdf',
      filePath: '/uploads/acme-inc/welcome.pdf',
      fileType: 'pdf',
      // metadataJson: { tags: ["welcome", "intro"] } if desired
    })
    .returning();

  console.log('Created document:', doc1);

  // 6) Optionally, insert a sample Chat History
  const [hist1] = await db
    .insert(chatHistory)
    .values({
      chatbotId: bot1.id,
      userId: adminUser.id,
      question: 'Hello, how can I get started?',
      answer: 'Welcome to our chatbot!',
      inputTokens: 15,
      outputTokens: 30,
    })
    .returning();

  console.log('Created chat history record:', hist1);

  // 7) Optionally, create a sample Billing / Invoice
  const [invoice1] = await db
    .insert(billing)
    .values({
      customerId: acmeCustomer.id,
      invoiceNumber: 'INV-1000',
      amount: 49.99,
      status: 'Pending',
      // issuedAt: defaults to now
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
    })
    .returning();

  console.log('Created billing record:', invoice1);

  // 8) Optionally, insert a DemoUsage record (if you want a 10-message limit for a user/bot)
  const [demoRec] = await db
    .insert(demoUsage)
    .values({
      userId: adminUser.id,
      chatbotId: bot1.id,
      messageCount: 0,
    })
    .returning();

  console.log('Created demo usage record:', demoRec);

  console.log('Seed process completed successfully!');
}

// Run the seed function
seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });