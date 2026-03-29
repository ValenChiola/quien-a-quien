import { useRef } from "react";
import { type User, MAX_NAME_LENGTH } from "../App";

export const AddUserForm = ({
  users,
  onSubmit,
}: {
  users: User[];
  onSubmit: (values: User) => void;
}) => {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: HTMLFormElement = e.currentTarget;
    const nameEl = form.elements.namedItem("name");

    if (!(nameEl instanceof HTMLInputElement)) return;

    const name = nameEl.value.trim();

    if (!name) return alert("Por favor complete el nombre del usuario");
    if (name.length > MAX_NAME_LENGTH)
      return alert("El nombre no puede tener más de 33 caracteres");

    const user = users.find((item) => item.name === name);

    onSubmit({ id: user?.id ?? Date.now(), name, payments: [] });

    form.reset();
    nameRef.current?.focus();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label className="label">
          Nombre:
          <input
            list="users"
            type="text"
            className="input"
            name="name"
            ref={nameRef}
            placeholder="Ej: Andy"
            autoComplete="off"
          />
        </label>
      </div>

      <button className="button">Agregar</button>
    </form>
  );
};
