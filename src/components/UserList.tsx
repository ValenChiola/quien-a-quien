import type { User } from "../App";

export const UserList = ({ users }: { users: User[] }) => (
  <ul className="list">
    {users.map((user) => (
      <li key={user.name} className="list-item">
        <span className="name" title={user.name}>
          {user.name}
        </span>
        <span className="amount">${user.amount}</span>
      </li>
    ))}
  </ul>
);
