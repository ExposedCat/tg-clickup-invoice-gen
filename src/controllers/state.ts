import { Composer } from 'grammy';

import type { User } from '../types/database.js';
import type { CustomContext } from '../types/context.js';
import { updateUser } from '../services/user.js';

export const stateController = new Composer<CustomContext>();

const STATES: User['state'][] = [
  'clickUp.privateKey',
  'clickUp.teamId',
  'clickUp.userId',
  'from.name',
  'from.address',
  'from.country',
  'from.postalCode',
  'from.ICO',
  'from.DIC',
  'to.name',
  'to.address',
  'to.country',
  'to.postalCode',
  'to.ICO',
  'to.DIC',
  'bank.name',
  'bank.iban',
  'bank.bic',
  'bank.currency',
  'bank.perHour',
  'free',
];

stateController.chatType('private').on('message:text', async ctx => {
  let nextState = ctx.user.state;
  if (ctx.user.state !== 'free' && ctx.message.text[0] !== '/') {
    const stateIndex = STATES.indexOf(ctx.user.state);
    nextState = STATES[stateIndex + 1];
    await updateUser({
      db: ctx.db,
      userId: ctx.from.id,
      update: {
        state: nextState,
        [ctx.user.state]: ctx.message.text,
      },
    });
  }
  await ctx.text(`state.${nextState ?? ctx.user.state}`);
});
