export const pickRandomArrayElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const isAppropiateStringLength = (
  min: number,
  max: number,
  str: string,
) => {
  return str.length >= min && str.length <= max;
};

export const isValueUndefinedOrNull = <T>(value: T) => {
  return !!value ?? false;
};
