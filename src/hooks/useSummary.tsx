import type { Payment, User } from "../App";

export const useSummary = ({
  users,
  payments,
}: {
  users: User[];
  payments: Payment[];
}) => {
  if (!payments || !users) return { total: 0, average: 0 };
  const total = payments.reduce((acc, p) => acc + p.totalAmount, 0);
  const average = users.length ? total / users.length : 0;

  return { total, average };
};
