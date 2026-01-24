export const getUniqueData = <T extends { [key: string]: any }>(
  input: T[],
  field: keyof T,
): T[] => {
  const uniqueData = input.filter((item, index, self) => {
    return index === self.findIndex(t => t[field] === item[field]);
  });
  return uniqueData;
};
