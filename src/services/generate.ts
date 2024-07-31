import fsp from 'fs/promises';

import {
  fetchTasks,
  getLastMonth,
  getThisMonth,
  PDF,
  renderCredentials,
  renderHeaders,
  renderTasks,
  renderTopBar,
  renderTotal,
  type FetchTasksArgs,
} from 'clickup-invoice-generator';

import type { User } from '../types/database.js';

export async function generateInvoice(user: User, period: FetchTasksArgs['period'] = 'this') {
  const [startDate] = period === 'this' ? getThisMonth() : getLastMonth();
  const month = new Date(startDate + 500).getMonth();
  const year = new Date(startDate + 500).getFullYear();
  const invoiceId = Number(`${user.userId}${month}${year}`);

  const pdf = await new PDF().init();

  renderTopBar({ pdf, invoiceId });

  renderHeaders({ pdf, from: user.from, to: user.to });

  renderCredentials({
    pdf,
    credentials: {
      bankName: user.bank.name,
      iban: user.bank.iban,
      bic: user.bank.bic,
      variable: String(invoiceId),
    },
  });

  const tasks = await fetchTasks({ clickUp: user.clickUp, period });
  const total = renderTasks({
    pdf,
    tasks,
    salary: {
      currency: user.bank.currency,
      perHour: Number(user.bank.perHour),
    },
  });

  renderTotal({ pdf, total, currency: user.bank.currency });

  const path = `/tmp/invoice-${Date.now()}-${user.userId}.pdf`;
  await pdf.save(path);

  return {
    path,
    cleanup: () => fsp.unlink(path),
  };
}
