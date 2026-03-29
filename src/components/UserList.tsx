import { useRef, useState } from "react";
import type { User } from "../App";

export const UserList = ({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const onEdit = (id: number, amount: number) =>
    setUsers((old) =>
      old.map((item) => (item.id === id ? { ...item, amount } : item)),
    );

  return (
    <ul className="list">
      {users.map((user) => (
        <li key={user.id} className="list-item">
          <span className="name" title={user.name}>
            {user.name}
          </span>
          {isEditing ? (
            <input type="text" ref={nameRef} defaultValue={user.amount} />
          ) : (
            <span className="amount">${user.amount}</span>
          )}
          {isEditing ? (
            <button
              onClick={(event) => {
                event.stopPropagation();
                if (!nameRef.current) return;

                const amount = +nameRef.current.value;
                if (amount < 0) return;

                onEdit(user.id, amount);
                setIsEditing(false);
              }}
            >
              Confirmar
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Editar</button>
          )}
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
};
