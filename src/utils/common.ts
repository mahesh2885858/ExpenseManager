import { v4 as uuid } from 'uuid';

export const generateRecordId = () => {
  return uuid();
};

export const getCurrentUTCTimeStamp = () => {
  return Date.now();
};
