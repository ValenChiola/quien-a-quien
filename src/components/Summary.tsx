import { type User, type Payment } from "../App";
import { useSummary } from "../hooks/useSummary";

export const Summary = (props: { users: User[]; payments: Payment[] }) => {
  const { total, average } = useSummary(props);

  return (
    <div className="summary">
      <h2 className="summary-title">
        <span className="total">Total: ${total}</span>
        <span className="average">Promedio: ${average.toFixed(2)}</span>
      </h2>
    </div>
  );
};
