import { uCFirst } from 'commonutil-core';

export const capitalizeEachWordInSentence = (sentence: string) => {
  let finalString = '';

  if (sentence.trim().length === 0) return sentence;

  const arr = sentence.split(' ');
  arr.forEach(word => {
    if (word.trim().length > 0) {
      finalString += ' ' + uCFirst(word);
    }
  });
  return finalString.trim();
};
