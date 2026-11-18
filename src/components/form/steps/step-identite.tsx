import {
  CheckboxField,
  Fieldset,
  RadioField,
  SelectField,
  TextField
} from '@/components/form/fields';
import { StepSignalement } from '@/components/form/steps/step-signalement';
import type { StepProps } from '@/components/form/steps/types';
import {
  ACCESSORIES,
  BRAKES,
  CATEGORIES,
  COLORS,
  FRAME_MATERIALS,
  GENDERS,
  SPEEDS,
  WHEEL_SIZES
} from '@/lib/options';
import type { AntiTheft, BikeAppearance, BikeIdentity } from '@/lib/types';

const EQUIPMENT: { key: keyof BikeAppearance; label: string }[] = [
  { key: 'lights', label: 'Éclairage' },
  { key: 'bell', label: 'Sonnette' },
  { key: 'rack', label: 'Porte-bagages' },
  { key: 'fenders', label: 'Garde-boue' },
  { key: 'kickstand', label: 'Béquille' },
  { key: 'basket', label: 'Panier' },
  { key: 'childSeat', label: 'Siège enfant' },
  { key: 'computer', label: 'Compteur' }
];

export function StepIdentite({ draft, errors, setSection, setFlag }: StepProps) {
  const identity = draft.identity;
  const appearance = draft.appearance;
  const patchIdentity = (value: Partial<BikeIdentity>) =>
    setSection('identity', value);
  const patchAppearance = (value: Partial<BikeAppearance>) =>
    setSection('appearance', value);
  const patchAntiTheft = (value: Partial<AntiTheft>) =>
    setSection('antiTheft', value);

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <SelectField
          label="Catégorie de vélo"
          value={identity.category}
          onValueChange={(category) => patchIdentity({ category })}
          options={CATEGORIES}
          placeholder="Sélectionnez une catégorie"
          error={errors['identity.category']}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Marque"
            value={identity.brand}
            onValueChange={(brand) => patchIdentity({ brand })}
            error={errors['identity.brand']}
            placeholder="Empower"
            required
          />

          <TextField
            label="Modèle"
            value={identity.model}
            onValueChange={(model) => patchIdentity({ model })}
            hint="Précisez l'année ou la finition si vous les connaissez."
            optional
            placeholder="E-City 500"
          />
        </div>

        <TextField
          label="Numéro de série"
          value={identity.frameNumber}
          onValueChange={(frameNumber) => patchIdentity({ frameNumber })}
          error={errors['identity.frameNumber']}
          hint="Gravé sous le boîtier de pédalier ou sur le tube de selle. 4 caractères minimum."
          className="font-mono uppercase"
          optional={!identity.frameNumberHidden}
          placeholder="EMP2203471"
        />

        <CheckboxField
          label="Je ne connais pas le numéro de série"
          description="Cochez cette case si le numéro est illisible ou inaccessible. Vous pourrez le compléter plus tard."
          checked={identity.frameNumberHidden}
          onCheckedChange={(frameNumberHidden) =>
            patchIdentity({ frameNumberHidden })
          }
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Année d'achat"
            value={identity.year}
            onValueChange={(year) =>
              patchIdentity({ year: year.replace(/\D/g, '').slice(0, 4) })
            }
            error={errors['identity.year']}
            hint={`Entre 1970 et ${currentYear + 1}.`}
            optional
            inputMode="numeric"
            placeholder="2023"
            maxLength={4}
          />

          <TextField
            label="Prix d'achat"
            value={identity.purchasePrice}
            onValueChange={(purchasePrice) =>
              patchIdentity({ purchasePrice: purchasePrice.replace(/[^\d.]/g, '') })
            }
            error={errors['identity.purchasePrice']}
            hint="Montant en euros, utile pour l'assurance."
            optional
            inputMode="decimal"
            placeholder="1890"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Lieu d'achat"
            value={identity.purchasePlace}
            onValueChange={(purchasePlace) => patchIdentity({ purchasePlace })}
            hint="Boutique, site web ou particulier."
            optional
            placeholder="Cyclo City, Paris 11e"
          />

          <TextField
            label="Nom sur la facture"
            value={identity.ownerNameOnInvoice}
            onValueChange={(ownerNameOnInvoice) =>
              patchIdentity({ ownerNameOnInvoice })
            }
            hint="Si la facture est au nom d'une autre personne."
            optional
            placeholder="Camille Rousseau"
          />
        </div>

        <CheckboxField
          label="Je possède la facture d'achat"
          description="La facture prouve que le vélo est bien à vous. Conservez-en une photo dans votre dossier."
          checked={identity.invoiceAvailable}
          onCheckedChange={(invoiceAvailable) =>
            patchIdentity({ invoiceAvailable })
          }
        />
      </div>

      <div className="space-y-6 border-t border-zinc-200/80 pt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Couleur principale"
            value={appearance.colorMain}
            onValueChange={(colorMain) => patchAppearance({ colorMain })}
            options={COLORS}
            placeholder="Sélectionnez une couleur"
            error={errors['appearance.colorMain']}
          />

          <SelectField
            label="Couleur secondaire"
            value={appearance.colorSecondary}
            onValueChange={(colorSecondary) =>
              patchAppearance({ colorSecondary })
            }
            options={COLORS}
            placeholder="Aucune"
            optional
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Matériau du cadre"
            value={appearance.frameMaterial}
            onValueChange={(frameMaterial) =>
              patchAppearance({ frameMaterial })
            }
            options={FRAME_MATERIALS}
            placeholder="Sélectionnez un matériau"
            optional
          />

          <SelectField
            label="Taille de roues"
            value={appearance.wheelSize}
            onValueChange={(wheelSize) => patchAppearance({ wheelSize })}
            options={WHEEL_SIZES}
            placeholder="Sélectionnez une taille"
            optional
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            label="Taille du cadre"
            value={appearance.frameSize}
            onValueChange={(frameSize) => patchAppearance({ frameSize })}
            hint="Taille inscrite sur le tube horizontal, par exemple M ou 54."
            optional
            placeholder="M"
          />

          <SelectField
            label="Nombre de vitesses"
            value={appearance.speed}
            onValueChange={(speed) => patchAppearance({ speed })}
            options={SPEEDS}
            placeholder="Sélectionnez"
            optional
          />
        </div>

        <RadioField
          label="Type de cadre"
          value={appearance.gender}
          onValueChange={(gender) => patchAppearance({ gender })}
          options={GENDERS}
          columns={3}
          hint="Enjambement haut ou enjambement bas."
        />

        <SelectField
          label="Freinage"
          value={appearance.brakes}
          onValueChange={(brakes) => patchAppearance({ brakes })}
          options={BRAKES}
          placeholder="Sélectionnez le type de freins"
          optional
        />

        <Fieldset
          legend="Équipements montés sur le vélo"
          description="Ces accessoires rendent votre vélo reconnaissable et constituent des cibles de vol en soi."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EQUIPMENT.map((item) => (
              <SelectField
                key={item.key}
                label={item.label}
                value={appearance[item.key]}
                onValueChange={(value) =>
                  patchAppearance({ [item.key]: value } as Partial<BikeAppearance>)
                }
                options={ACCESSORIES}
                placeholder="Non précisé"
                optional
              />
            ))}
          </div>
        </Fieldset>

        <TextField
          label="Autres équipements"
          value={appearance.otherEquipment}
          onValueChange={(otherEquipment) =>
            patchAppearance({ otherEquipment })
          }
          hint="Antivol intégré, housse, support de téléphone, pneus particuliers…"
          optional
          placeholder="Support de téléphone, pneus anti-crevaison, béquille arrière"
        />
      </div>

      <div className="space-y-6 border-t border-zinc-200/80 pt-8">
        <TextField
          label="Numéro Bicycode ou autre marquage"
          value={draft.antiTheft.code}
          onValueChange={(code) => patchAntiTheft({ code })}
          error={errors['antiTheft.code']}
          hint="BICYCODE (FUB), Dataverso, gravure maison… Indiquez le numéro relevé sur le cadre."
          className="font-mono uppercase"
          optional
          placeholder="75AB12345"
        />

        <CheckboxField
          label="Ce marquage est enregistré à mon nom"
          description="Un marquage déclaré auprès de son opérateur permet de retrouver le propriétaire en cas de contrôle."
          checked={draft.antiTheft.codeRegistered}
          onCheckedChange={(codeRegistered) => patchAntiTheft({ codeRegistered })}
        />
      </div>

      <div className="border-t border-zinc-200/80 pt-8">
        <StepSignalement
          draft={draft}
          errors={errors}
          setSection={setSection}
          setFlag={setFlag}
        />
      </div>
    </div>
  );
}
