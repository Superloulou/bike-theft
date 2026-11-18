import {
  FieldError,
  Fieldset,
  TextareaField
} from '@/components/form/fields';
import type { StepProps } from '@/components/form/steps/types';
import type { BikeMarks } from '@/lib/types';

export function StepSignalement({ draft, errors, setSection }: StepProps) {
  const marks = draft.marks;
  const patch = (value: Partial<BikeMarks>) => setSection('marks', value);

  return (
    <div className="space-y-8">
      <Fieldset
        legend="Ce qui permet de reconnaître ce vélo"
        description="Au moins un renseignement. Un autocollant décollé, une rayure de chute ou un porte-bidon ajouté permettent de confirmer une identité avec une certitude qu'aucun numéro ne remplace."
      >
        <TextareaField
          label="Autocollants et décalcomanies"
          value={marks.stickers}
          onValueChange={(stickers) => patch({ stickers })}
          hint="Marques, emplacements, couleurs, autocollants décollés ou manquants."
          optional
          rows={3}
          placeholder="Autocollant Mavic jaune sur la fourche, décalcomanie du cadre usée côté droit."
        />

        <TextareaField
          label="Gravures et marquages"
          value={marks.engravings}
          onValueChange={(engravings) => patch({ engravings })}
          hint="Numéro de série gravé, initiales, marquage BICYCODE, points de peinture."
          optional
          rows={3}
          placeholder="Marquage BICYCODE AB12CD34 gravé sous le boîtier de pédalier."
        />

        <TextareaField
          label="Rayures, chocs, réparations"
          value={marks.scratches}
          onValueChange={(scratches) => patch({ scratches })}
          hint="Décrivez les défauts visibles et leur emplacement exact."
          optional
          rows={3}
          placeholder="Choc sur le tube supérieur à 10 cm de la potence, peinture écaillée jusqu'au métal."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <TextareaField
            label="Peinture ou retouches"
            value={marks.repaint}
            onValueChange={(repaint) => patch({ repaint })}
            hint="Le vélo a-t-il été repeint ou retouché ?"
            optional
            rows={3}
            placeholder="Cadre repeint en vert mat en 2023, bandes d'origine conservées sous le tube diagonal."
          />

          <TextareaField
            label="Pièces modifiées"
            value={marks.customParts}
            onValueChange={(customParts) => patch({ customParts })}
            hint="Composants remplacés par rapport à la configuration d'origine."
            optional
            rows={3}
            placeholder="Selle Brooks B17, pédales plate-forme, guidon droit en remplacement du cintre."
          />
        </div>

        <FieldError message={errors['marks.details']} />
      </Fieldset>

      <div className="border-t border-zinc-200/80 pt-8">
        <TextareaField
          label="Emplacement de vos photos"
          value={marks.photos}
          onValueChange={(photos) => patch({ photos })}
          hint="Liens d'un dossier partagé, ou liste des vues que vous conservez. Les photos ne sont pas téléversées dans cette maquette."
          optional
          rows={3}
          placeholder="Vue 3/4 avant, cadre côté transmission, gravement sous le boîtier, antivol posé."
        />
      </div>
    </div>
  );
}
