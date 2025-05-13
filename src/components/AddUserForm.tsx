import { useRef } from "react";
import { type User, MINIMUM_DEBT_AMOUNT } from "../App";

export const AddUserForm = ({
  onSubmit,
}: {
  onSubmit: (values: User) => void;
}) => {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: HTMLFormElement = e.currentTarget;
    const nameEl = form.elements.namedItem("name");
    const amountEl = form.elements.namedItem("amount");

    if (
      !(nameEl instanceof HTMLInputElement) ||
      !(amountEl instanceof HTMLInputElement)
    )
      return;

    const name = nameEl.value.trim();
    let amount = +amountEl.value.replace(",", ".");

    if (!name) return alert("Por favor complete el nombre del usuario");
    if (name.length > 33)
      return alert("El nombre no puede tener más de 33 caracteres");

    if (isNaN(amount)) return alert("El monto debe ser un número");
    if (amount < 0) return alert("El monto no puede ser negativo");
    if (amount < MINIMUM_DEBT_AMOUNT) amount = 0;

    onSubmit({ name, amount });

    form.reset();
    nameRef.current?.focus();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label className="label">
          Nombre:
          <input
            type="text"
            className="input"
            name="name"
            ref={nameRef}
            placeholder="Ej: Andy"
          />
        </label>
      </div>

      <div className="input-container">
        <label className="label">
          Cuánto dinero puso:
          <input className="input" name="amount" placeholder="Ej: 150.50" />
        </label>
      </div>

      <button className="button">Agregar</button>
    </form>
  );
};
