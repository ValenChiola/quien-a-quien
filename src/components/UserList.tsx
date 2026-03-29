import type { User } from "../App";

export const UserList = ({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) => (
  <ul className="list">
    {users.map((user) => (
      <li key={user.id} className="list-item">
        <span className="name" title={user.name}>
          {user.name}
        </span>
        <button
          onClick={() =>
            setUsers((old) => old.filter((item) => item.id !== user.id))
          }
        >
          X
        </button>
      </li>
    ))}
  </ul>
);
