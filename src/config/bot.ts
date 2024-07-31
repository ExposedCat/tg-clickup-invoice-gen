import { Bot as TelegramBot, session } from 'grammy';
import type { I18n } from '@grammyjs/i18n/dist/source/i18n.js';

import type { Bot } from '../types/telegram.js';
import type { Database } from '../types/database.js';
import type { CustomContext } from '../types/context.js';
import { getOrCreateUser } from '../services/user.js';
import { createReplyWithTextFunc } from '../services/context.js';
import { resolvePath } from '../helpers/resolve-path.js';
import { stateController } from '../controllers/state.js';
import { initLocaleEngine } from './locale-engine.js';

function extendContext(bot: Bot, database: Database) {
  bot.use(async (ctx, next) => {
    if (!ctx.chat || !ctx.from) {
      return;
    }

    ctx.text = createReplyWithTextFunc(ctx);
    ctx.db = database;

    ctx.user = await getOrCreateUser({
      db: database,
      userId: ctx.from.id,
    });

    await next();
  });
}

function setupMiddlewares(bot: Bot, localeEngine: I18n) {
  bot.use(session());
  bot.use(localeEngine.middleware());
  // eslint-disable-next-line github/no-then
  bot.catch(console.error);
}

function setupControllers(bot: Bot) {
  bot.use(stateController);
}

export async function startBot(database: Database) {
  const localesPath = resolvePath(import.meta.url, '../locales');
  const i18n = initLocaleEngine(localesPath);
  const bot = new TelegramBot<CustomContext>(process.env.TOKEN);

  extendContext(bot, database);
  setupMiddlewares(bot, i18n);
  setupControllers(bot);

  return new Promise(resolve =>
    bot.start({
      onStart: () => resolve(undefined),
    }),
  );
}
