import { ColumnState, PrismaClient } from '../generated/prisma';

const db = new PrismaClient();

async function seed() {
  // Write your seed data here
  await db.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });
  await db.column.createMany({
    data: [
      { state: ColumnState.TODO },
      { state: ColumnState.IN_PROGRESS },
      { state: ColumnState.COMPLETED },
    ],
  });
}

seed()
  .then(async () => {
    await db.$disconnect();
    console.log('DB populated.');
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
