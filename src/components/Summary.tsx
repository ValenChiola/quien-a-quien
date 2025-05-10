import { type User } from "../App";
import { useSummary } from "../hooks/useSummary";
import { UserList } from "./UserList";

export const Summary = ({ users }: { users: User[] }) => {
  const { total, average } = useSummary(users);

  return (
    <div className="summary">
      <h2 className="summary-title">
        <span className="total">Total: ${total}</span>
        <span className="average">Promedio: ${average.toFixed(2)}</span>
      </h2>

      <UserList users={users} />
    </div>
  );
};
