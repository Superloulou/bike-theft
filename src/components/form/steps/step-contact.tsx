import { TextField } from '@/components/form/fields';
import type { StepProps } from '@/components/form/steps/types';

export function StepContact({ draft, errors, setSection }: StepProps) {
  const contact = draft.contact;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Prénom"
          value={contact.firstName}
          onValueChange={(firstName) => setSection('contact', { firstName })}
          error={errors['contact.firstName']}
          autoComplete="given-name"
          placeholder="Camille"
          required
        />

        <TextField
          label="Nom"
          value={contact.lastName}
          onValueChange={(lastName) => setSection('contact', { lastName })}
          error={errors['contact.lastName']}
          autoComplete="family-name"
          placeholder="Rousseau"
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="E-mail"
          type="email"
          value={contact.email}
          onValueChange={(email) => setSection('contact', { email })}
          error={errors['contact.email']}
          autoComplete="email"
          placeholder="camille.rousseau@example.fr"
          required
        />

        <TextField
          label="Téléphone"
          type="tel"
          value={contact.phone}
          onValueChange={(phone) => setSection('contact', { phone })}
          error={errors['contact.phone']}
          hint="Numéro utile si un agent reconnaît votre vélo."
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          optional
        />
      </div>
    </div>
  );
}
