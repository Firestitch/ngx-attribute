import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { FieldExampleComponent } from '../field-example/field-example.component';
import { FieldWithGroupsExampleComponent } from '../field-with-groups-example/field-with-groups-example.component';
import { SelectorExampleComponent } from '../selector-example/selector-example.component';
import { GroupSelectorExampleComponent } from '../group-selector-example/group-selector-example.component';
import { AutocompleteChipsComponent } from '../autocomplete-chips/autocomplete-chips.component';
import { ListExampleComponent } from '../list-example/list-example.component';
import { AttribtuesExampleComponent } from '../attribtues-example/attribtues-example.component';
import { TreeExampleComponent } from '../tree-example/tree-example.component';


@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsExampleModule,
        FieldExampleComponent,
        FieldWithGroupsExampleComponent,
        SelectorExampleComponent,
        GroupSelectorExampleComponent,
        AutocompleteChipsComponent,
        ListExampleComponent,
        AttribtuesExampleComponent,
        TreeExampleComponent,
    ],
})
export class ExamplesComponent {
  public config = environment;
}
