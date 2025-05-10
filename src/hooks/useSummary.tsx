import type { User } from "../App";

export const useSummary = (users: User[]) => {
  const total = users.reduce((acc, { amount }) => acc + amount, 0);
  const average = total ? total / users.length : 0;

  return { total, average };
};
