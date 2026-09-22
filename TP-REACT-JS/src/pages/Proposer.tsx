import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";

const emptyForm = { title: "", year: "", technique: "", email: "" };

// Fonction pure : elle reçoit les valeurs et renvoie les erreurs trouvées.
function validate(values: typeof emptyForm) {
  const errors: Record<string, string> = {};
  if (values.title.trim().length < 2) errors.title = "Au moins 2 caractères.";
  if (!/^\d{4}$/.test(values.year)) errors.year = "4 chiffres attendus.";
  if (values.technique === "") errors.technique = "Choisissez une technique.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Email invalide.";
  return errors;
}

export default function Proposer() {
  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState(false);

  // Les erreurs se recalculent à chaque rendu : pas de state pour les stocker.
  const errors = validate(values);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setSuccess(false);
  }

  // On n'affiche l'erreur d'un champ qu'une fois que l'utilisateur l'a quitté.
  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    setTouched((previous) => ({ ...previous, [event.target.name]: true }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setValues(emptyForm);
    setTouched({});
    setSuccess(true);
  }

  return (
    <>
      <h2>Proposer une œuvre</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="title">Titre</label>{" "}
          <input id="title" name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} />
          {touched.title && errors.title && <span> {errors.title}</span>}
        </p>
        <p>
          <label htmlFor="year">Année</label>{" "}
          <input id="year" name="year" value={values.year} onChange={handleChange} onBlur={handleBlur} />
          {touched.year && errors.year && <span> {errors.year}</span>}
        </p>
        <p>
          <label htmlFor="technique">Technique</label>{" "}
          <select id="technique" name="technique" value={values.technique} onChange={handleChange} onBlur={handleBlur}>
            <option value="">Choisir</option>
            {["Peinture", "Sculpture", "Photographie", "Dessin"].map((technique) => (
              <option key={technique} value={technique}>{technique}</option>
            ))}
          </select>
          {touched.technique && errors.technique && <span> {errors.technique}</span>}
        </p>
        <p>
          <label htmlFor="email">Email</label>{" "}
          <input id="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {touched.email && errors.email && <span> {errors.email}</span>}
        </p>

        <button type="submit" disabled={Object.keys(errors).length > 0}>Envoyer</button>
      </form>

      {success && <p>Proposition envoyée.</p>}
    </>
  );
}
