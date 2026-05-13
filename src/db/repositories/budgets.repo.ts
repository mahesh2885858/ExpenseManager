import { db } from '../index';
import { getCurrentUTCTimeStamp } from '../../utils';
import { TBudget, TBudgetPayload } from '../../types';
import { getRangeForBudgetPeriod } from '../../utils/getRangeForBudgetPeriod';

const table = 'budgets';

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

  return Number(result.rows[0]?.spent ?? 0);
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
        budget.amount,
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
        categories,
        spent,
        remaining: row.amount - spent,
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

      const values = entries.map(([, value]) => value);

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

export const budgetRepo = {
  create: addBudget,
  getAll: getBudgets,
  update: updateBudget,
  delete: deleteBudget,
};
