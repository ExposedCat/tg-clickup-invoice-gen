import type { UpdateFilter } from 'mongodb';

import type { Database, User } from '../types/database.js';

export async function getOrCreateUser(args: { db: Database; userId: number }): Promise<User> {
  const user = await args.db.user.findOneAndUpdate(
    { userId: args.userId },
    {
      $setOnInsert: {
        userId: args.userId,
        state: 'clickUp.privateKey',
        clickUp: {
          privateKey: '',
          teamId: '',
          userId: '',
        },
        from: {
          name: '',
          address: '',
          country: '',
          postalCode: '',
        },
        to: {
          name: '',
          address: '',
          country: '',
          postalCode: '',
        },
        bank: {
          name: '',
          iban: '',
          bic: '',
          currency: '',
          perHour: '',
        },
      },
    },
    { upsert: true, returnDocument: 'after' },
  );

  if (!user.value) {
    throw new Error(`Failed to create user with ID ${args.userId}`);
  }

  return user.value;
}

export async function updateUser(args: { db: Database; userId: number; update: UpdateFilter<User>['$set'] }) {
  return args.db.user.updateOne({ userId: args.userId }, { $set: args.update });
}
