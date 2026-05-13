import { db } from '../index';
import { getCurrentUTCTimeStamp, money } from '../../utils';
import { TBudget, TBudgetPayload } from '../../types';
import { getRangeForBudgetPeriod } from '../../utils/getRangeForBudgetPeriod';

const table = 'budgets';
type GetBudgetTransactionsParams = {
  budgetId: string;
  recurring_type: 'weekly' | 'monthly' | 'yearly' | 'one-time';
  start_date: number;
  end_date?: number;
};
const getBudgetSpent = async (budgetId: string, start: number, end: number) => {
  const result = await db.execute(
    `
    SELECT
      COALESCE(SUM(t.amount), 0) as spent

    FROM transactions t

    INNER JOIN budget_categories bc
      ON bc.category_id = t.category_id

    WHERE bc.budget_id = ?
      AND t.type = 'expense'
      AND t.transaction_date >= ?
      AND t.transaction_date < ?
    `,
    [budgetId, start, end],
  );

  return money.fromStored(Number(result.rows[0]?.spent ?? 0));
};

const addBudget = async (budget: TBudgetPayload) => {
  const now = getCurrentUTCTimeStamp();

  await db.transaction(async tx => {
    // create budget
    await tx.execute(
      `
      INSERT INTO ${table} (
        id,
        amount,
        name,
        recurring_type,
        created_at,
        start_date,
        end_date,
        profile_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        budget.id,
        money.toStored(budget.amount),
        budget.name,
        budget.recurring_type,
        now,
        budget.start_date,
        budget.end_date ?? null,
        budget.profile_id,
      ],
    );

    // insert category mappings
    for (const categoryId of budget.category_ids) {
      await tx.execute(
        `
        INSERT INTO budget_categories (
          budget_id,
          category_id
        )
        VALUES (?, ?)
        `,
        [budget.id, categoryId],
      );
    }
  });
};

const getBudgets = async (profileId: string) => {
  const result = await db.execute(
    `
    SELECT
      b.*,

      COALESCE(
        json_group_array(
          CASE
            WHEN c.id IS NOT NULL THEN
              json_object(
                'id', c.id,
                'name', c.name,
                'icon', c.icon,
                'type', c.type
              )
          END
        ),
        '[]'
      ) as categories

    FROM budgets b

    LEFT JOIN budget_categories bc
      ON bc.budget_id = b.id

    LEFT JOIN categories c
      ON c.id = bc.category_id

    WHERE b.profile_id = ?

    GROUP BY b.id

    ORDER BY b.created_at DESC
    `,
    [profileId],
  );

  const budgets = await Promise.all(
    result.rows.map(async (row: any) => {
      let categories = JSON.parse(row.categories);

      categories = categories.map((cat: any) => ({
        ...cat,
        icon: JSON.parse(cat.icon),
      }));

      const { start, end } = getRangeForBudgetPeriod({
        type: row.recurring_type,
        range:
          row.recurring_type === 'one-time'
            ? { end: row.end_date, start: row.start_date }
            : undefined,
      });

      const spent = await getBudgetSpent(row.id, start, end);

      return {
        ...row,
        amount: money.fromStored(row.amount),
        categories,
        spent,
        remaining: money.fromStored(row.amount) - spent,
      };
    }),
  );

  return budgets;
};

const updateBudget = async (
  id: string,
  updates: Partial<Omit<TBudget, 'id' | 'categoryIds'>>,
  categoryIds?: string[],
) => {
  await db.transaction(async tx => {
    // update budget fields
    const entries = Object.entries(updates);

    if (entries.length > 0) {
      const setClause = entries
        .map(([key]) => {
          switch (key) {
            case 'recurringType':
              return 'recurring_type = ?';

            case 'startDate':
              return 'start_date = ?';

            case 'endDate':
              return 'end_date = ?';

            case 'profileId':
              return 'profile_id = ?';

            default:
              return `${key} = ?`;
          }
        })
        .join(', ');

      const values = entries.map(([key, value]) =>
        key === 'amount' ? money.toStored(value as number) : value,
      );

      await tx.execute(
        `
        UPDATE budgets
        SET ${setClause}
        WHERE id = ?
        `,
        [...values, id],
      );
    }

    // update category mappings
    if (categoryIds) {
      // remove old mappings
      await tx.execute(
        `
        DELETE FROM budget_categories
        WHERE budget_id = ?
        `,
        [id],
      );

      // insert new mappings
      for (const categoryId of categoryIds) {
        await tx.execute(
          `
          INSERT INTO budget_categories (
            budget_id,
            category_id
          )
          VALUES (?, ?)
          `,
          [id, categoryId],
        );
      }
    }
  });
};

const deleteBudget = async (id: string) => {
  await db.execute(
    `
    DELETE FROM budgets
    WHERE id = ?
    `,
    [id],
  );
};

const getBudgetTransactions = async ({
  budgetId,
  recurring_type,
  start_date,
  end_date,
}: GetBudgetTransactionsParams) => {
  const { start, end } = getRangeForBudgetPeriod({
    type: recurring_type,
    range:
      recurring_type === 'one-time'
        ? { end: end_date, start: start_date }
        : undefined,
  });

  const result = await db.execute(
    `
    SELECT
      t.*,

      json_object(
        'id', c.id,
        'name', c.name,
        'icon', c.icon,
        'type', c.type
      ) as category,

      json_object(
        'id', w.id,
        'name', w.name
      ) as wallet

    FROM transactions t

    INNER JOIN budget_categories bc
      ON bc.category_id = t.category_id

    LEFT JOIN categories c
      ON c.id = t.category_id

    LEFT JOIN wallets w
      ON w.id = t.wallet_id

    WHERE bc.budget_id = ?
      AND t.type = 'expense'
      AND t.transaction_date >= ?
      AND t.transaction_date < ?

    ORDER BY t.transaction_date DESC
    `,
    [budgetId, start, end],
  );

  return result.rows.map((row: any) => ({
    ...row,
    amount: money.fromStored(row.amount),
    category: {
      ...JSON.parse(row.category),
      icon: JSON.parse(JSON.parse(row.category).icon),
    },

    wallet: JSON.parse(row.wallet),
  }));
};
export const budgetRepo = {
  create: addBudget,
  getAll: getBudgets,
  update: updateBudget,
  delete: deleteBudget,
  getBudgetTransactions,
};
