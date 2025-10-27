import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AttributeConfig } from '@firestitch/attribute';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsAttributeAutocompleteChipsComponent } from '../../../../src/app/components/attribute-autocomplete-chips/attribute-autocomplete-chips.component';
import { FsAttributeAutocompleteChipsStaticDirective } from '../../../../src/app/directives/attribute-autocomplete-chips-static.component';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'autocomplete-chips',
    templateUrl: './autocomplete-chips.component.html',
    styleUrls: ['./autocomplete-chips.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsAttributeAutocompleteChipsComponent,
        FsAttributeAutocompleteChipsStaticDirective,
        JsonPipe,
    ],
})
export class AutocompleteChipsComponent {

  public attributes;
  public class = 'person';
  public attributeConfig: AttributeConfig = {
    class: 'animal',
    name: 'Animal',
    pluralName: 'Animals',
  };

  public changed(e) {
    console.log(e);
  }

  public staticClick(e) {
    console.log('static clicked');
  }

  public save() {
    //
  }
}
