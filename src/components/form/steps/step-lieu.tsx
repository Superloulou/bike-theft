import {
  CheckboxField,
  SelectField,
  TextField,
  TextareaField
} from '@/components/form/fields';
import type { StepProps } from '@/components/form/steps/types';
import { LOCK_TYPES, PLACE_TYPES } from '@/lib/options';
import type { Location } from '@/lib/types';

function maxDateTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export function StepLieu({ draft, errors, setSection }: StepProps) {
  const location = draft.location;
  const patch = (value: Partial<Location>) => setSection('location', value);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[7rem_1fr_1fr]">
        <TextField
          label="Code postal"
          value={location.postalCode}
          onValueChange={(postalCode) =>
            patch({ postalCode: postalCode.replace(/\D/g, '').slice(0, 5) })
          }
          error={errors['location.postalCode']}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="75011"
          maxLength={5}
          required
        />

        <TextField
          label="Ville"
          value={location.city}
          onValueChange={(city) => patch({ city })}
          error={errors['location.city']}
          autoComplete="address-level2"
          placeholder="Paris"
          required
        />

        <TextField
          label="Département"
          value={location.departement}
          onValueChange={(departement) => patch({ departement })}
          error={errors['location.departement']}
          hint="Numéro ou nom, par exemple 75 ou Paris."
          placeholder="75"
          maxLength={60}
          required
        />
      </div>

      <TextField
        label="Adresse ou point de repère"
        value={location.address}
        onValueChange={(address) => patch({ address })}
        hint="Rue, place, nom du bâtiment ou du parking."
        optional
        autoComplete="street-address"
        placeholder="12 rue Oberkampf, devant le n° 3"
      />

      <SelectField
        label="Type de lieu"
        value={location.placeType}
        onValueChange={(placeType) => patch({ placeType })}
        options={PLACE_TYPES}
        placeholder="Sélectionnez le type de lieu"
        error={errors['location.placeType']}
      />

      <TextField
        label="Date et heure du vol"
        type="datetime-local"
        value={location.stolenAt}
        onValueChange={(stolenAt) => patch({ stolenAt })}
        error={errors['location.stolenAt']}
        hint="Indiquez l’heure de constatation si l’heure exacte est inconnue."
        max={maxDateTime()}
        required
      />

      <CheckboxField
        label="Heure approximative"
        description="L’heure indiquée est une estimation : je ne sais pas à quelle heure exacte le vélo a disparu."
        checked={location.timeApprox}
        onCheckedChange={(timeApprox) => patch({ timeApprox })}
      />

      <CheckboxField
        label="Le vélo était verrouillé"
        description="Précisez le type d'antivol : c'est un élément important du dossier."
        checked={location.wasLocked}
        onCheckedChange={(wasLocked) => patch({ wasLocked })}
      />

      {location.wasLocked ? (
        <SelectField
          label="Antivol utilisé"
          value={location.lockType}
          onValueChange={(lockType) => patch({ lockType })}
          options={LOCK_TYPES}
          placeholder="Sélectionnez le type d'antivol"
          error={errors['location.lockType']}
        />
      ) : null}

      <TextareaField
        label="Circonstances du vol"
        value={location.policeReport}
        onValueChange={(policeReport) => patch({ policeReport })}
        hint="Comment le vélo était attaché, à quoi ressemblait l'endroit, ce qui a disparu avec le vélo."
        optional
        rows={4}
        placeholder="Antivol en U autour du cadre et d'un poteau. Cadenas du casque forcé, compteur et lumières dérobés."
      />
    </div>
  );
}
