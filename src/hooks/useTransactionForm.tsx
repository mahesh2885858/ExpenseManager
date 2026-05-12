import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuid } from 'uuid';
import {
  TAttachment,
  TCategory,
  TRootStackParamList,
  TTransaction,
  TTransactionType,
} from '../types';
import { getCurrentUTCTimeStamp } from '../utils';

export type TTransactionFormState = {
  type: TTransactionType;
  amountInput: string;
  date: CalendarDate;
  time: {
    hours: number;
    minutes: number;
  };
  description: string;
  attachments: TAttachment[];
  walletId: string;
  categoryId: string | null;
};

type ErrorField = 'amount' | 'wallet' | 'category';

export const useTransactionForm = ({
  categories,
  defaultCategoryId,
  defaultWalletId,
  addTransaction,
  updateTransaction,
  selectedProfileId,
}: {
  categories: TCategory[];
  defaultCategoryId?: string | null;
  defaultWalletId: string;
  addTransaction: (tx: TTransaction) => Promise<void>;
  updateTransaction: (tx: TTransaction) => Promise<void>;
  selectedProfileId: string;
}) => {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<TRootStackParamList, 'AddTransaction'>>();

  const isEditMode = route.params.mode === 'edit';

  const initialState: TTransactionFormState = useMemo(() => {
    if (isEditMode) {
      const tr = route.params.transaction;
      const trDate = new Date(tr.transaction_date);

      return {
        type: tr.type,
        amountInput: tr.amount.toString(),
        date: trDate,
        description: tr.description ?? '',
        attachments: tr.attachments ?? [],
        categoryId: tr.category_id,
        walletId: tr.wallet_id,
        time: {
          hours: trDate.getHours(),
          minutes: trDate.getMinutes(),
        },
      };
    }

    const now = new Date();

    return {
      type: route.params.type === 'INCOME' ? 'income' : 'expense',
      amountInput: '',
      date: now,
      description: '',
      attachments: [],
      walletId: defaultWalletId,
      categoryId:
        categories.length === 1
          ? categories[0]?.id ?? defaultCategoryId ?? null
          : defaultCategoryId ?? null,
      time: {
        hours: now.getHours(),
        minutes: now.getMinutes(),
      },
    };
  }, [categories, defaultCategoryId, defaultWalletId, isEditMode, route]);

  const [form, setForm] = useState<TTransactionFormState>(initialState);

  const [errorFields, setErrorFields] = useState<ErrorField[]>([]);

  const updateField = useCallback(
    <K extends keyof TTransactionFormState>(
      key: K,
      value: TTransactionFormState[K],
    ) => {
      setForm(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const clearError = useCallback((field: ErrorField) => {
    setErrorFields(prev => prev.filter(f => f !== field));
  }, []);

  const validate = useCallback(() => {
    const errors: ErrorField[] = [];

    if (!form.walletId) {
      errors.push('wallet');
    }

    if (!form.categoryId) {
      errors.push('category');
    }

    const amount = parseFloat(form.amountInput);

    if (!form.amountInput || Number.isNaN(amount) || amount <= 0) {
      errors.push('amount');
    }

    setErrorFields(errors);

    if (errors.length > 0) {
      return null;
    }

    return {
      amount,
    };
  }, [form]);

  const mergedDate = useMemo(() => {
    const d = new Date(form.date);

    d.setHours(form.time.hours);
    d.setMinutes(form.time.minutes);

    return d;
  }, [form.date, form.time]);

  const saveTransaction = useCallback(async () => {
    const validated = validate();

    if (!validated) {
      return;
    }

    if (isEditMode) {
      const updated: TTransaction = {
        ...route.params.transaction,
        amount: validated.amount,
        category_id: form.categoryId!,
        wallet_id: form.walletId,
        transaction_date: mergedDate.getTime(),
        type: form.type,
        attachments: form.attachments,
        description: form.description,
      };

      await updateTransaction(updated);
    } else {
      await addTransaction({
        id: uuid(),
        amount: validated.amount,
        category_id: form.categoryId!,
        wallet_id: form.walletId,
        transaction_date: mergedDate.getTime(),
        created_at: getCurrentUTCTimeStamp(),
        type: form.type,
        attachments: form.attachments,
        description: form.description,
        profileId: selectedProfileId,
      });
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainBottomTabs' }],
    });
  }, [
    addTransaction,
    form,
    isEditMode,
    mergedDate,
    navigation,
    route,
    selectedProfileId,
    updateTransaction,
    validate,
  ]);

  return {
    form,
    errorFields,
    updateField,
    clearError,
    saveTransaction,
    mergedDate,
    isEditMode,
  };
};
