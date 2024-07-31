import { Composer, InputFile } from 'grammy';

import type { CustomContext } from '../types/context.js';
import { generateInvoice } from '../services/generate.js';

export const generateController = new Composer<CustomContext>();

generateController.chatType('private').command(['current', 'last'], async (ctx, next) => {
  if (ctx.user.state !== 'free') {
    await next();
  }

  const { path, cleanup } = await generateInvoice(ctx.user, ctx.message.text.startsWith('/current') ? 'this' : 'last');

  try {
    await ctx.replyWithDocument(new InputFile(path));
  } catch (error) {
    await ctx.text('error', { error });
  } finally {
    await cleanup();
  }
});
