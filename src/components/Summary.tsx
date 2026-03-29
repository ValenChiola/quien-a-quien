import { type User } from "../App";
import { useSummary } from "../hooks/useSummary";
import { UserList } from "./UserList";

export const Summary = (props: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  const { total, average } = useSummary(props.users);

  return (
    <div className="summary">
      <h2 className="summary-title">
        <span className="total">Total: ${total}</span>
        <span className="average">Promedio: ${average.toFixed(2)}</span>
      </h2>

      <UserList {...props} />
    </div>
  );
};
