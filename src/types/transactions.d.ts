export type TTransactionType = 'income' | 'expense';

export type TAttachment = {
  name: string;
  path: string;
  size: number; // Size in bytes, max 5MB
  extension: string;
};

export type TTransaction = {
  id: string;
  accountId: string; // ID associated with account to which this transaction is added
  type: TTransactionType; // Only either income or expense
  amount: number;
  createdAt: string; // ISO string format - when the transaction took place
  categoryIds: string[]; // Category IDs (initially single category per transaction)
  description?: string; // Optional field
  attachments?: TAttachment[]; // Array of attachments (images and PDFs)
};
