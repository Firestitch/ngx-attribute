import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsFormModule } from '@firestitch/form';
import { FsListModule } from '@firestitch/list';

import { FsScrollModule } from '@firestitch/scroll';
import { FsFileModule } from '@firestitch/file';
import { FsLabelModule } from '@firestitch/label';
import { FsChipModule } from '@firestitch/chip';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsTreeModule } from '@firestitch/tree';
import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsMenuModule } from '@firestitch/menu';
import { FsDialogModule } from '@firestitch/dialog';

import { FsAttributeComponent } from './components/attribute/attribute.component';
import { FsAttributeFieldComponent } from './components/attribute-field/attribute-field.component';
import { FsAttributesComponent } from './components/attributes/attributes.component';
import { FsAttributeSelectorComponent } from './components/attribute-selector/attribute-selector.component';
import { FsAttributeEditComponent } from './components/attribute-edit/attribute-edit.component';
import { FsAttributeManageComponent } from './components/attribute-manage/attribute-manage.component';
import { FsAttributeListComponent } from './components/attribute-list/attribute-list.component';
import { FsAttributeSelectComponent } from './components/attribute-select/attribute-select.component';
import { FsAttributeAutocompleteChipsComponent } from './components/attribute-autocomplete-chips/attribute-autocomplete-chips.component';
import { FsAttributeAutocompleteComponent } from './components/attribute-autocomplete/attribute-autocomplete.component';
import { FsAttributeComponentWrapperComponent } from './components/attribute-list/component-wrapper/component-wrapper.component';
import { FsAttributeTreeComponent } from './components/attribute-tree/attribute-tree.component';
import { FsAttributeFieldGroupsComponent } from './components/attribute-field-groups/attribute-field-groups.component';
import { AttributeSearchComponent } from './components/search/search.component';
import { FsAttributeSelectorWithGroupsComponent } from './components/selector-with-groups/selector-with-groups.component';
import { FsAttributeListColumnDirective } from './directives/list-column.directive';
import { FsAttributeAutocompleteChipsStaticDirective } from './directives/attribute-autocomplete-chips-static.component';
import { FsAttributeTemplateDirective } from './directives/attribute-template.component';
import { FS_ATTRIBUTE_DEFAULT_CONFIG } from './providers';
import { FsAttributeConfig } from './interfaces/attribute-config.interface';
import { AttributesConfig } from './services/attributes-config';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,

    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,

    FsColorPickerModule,
    FsFormModule,
    FsLabelModule,
    FsAutocompleteChipsModule,
    FsChipModule,
    FsListModule,
    FsScrollModule,
    FsFileModule,
    FsTreeModule,
    FsAutocompleteModule,
    FsMenuModule,
    FsDialogModule,
  ],
  exports: [
    FsAttributeComponent,
    FsAttributesComponent,
    FsAttributeFieldComponent,
    FsAttributeListComponent,
    FsAttributeSelectComponent,
    FsAttributeAutocompleteChipsComponent,
    FsAttributeTreeComponent,
    FsAttributeFieldGroupsComponent,
    FsAttributeAutocompleteComponent,
    FsAttributeSelectorComponent,
    FsAttributeSelectorWithGroupsComponent,
    FsAttributeListColumnDirective,
    FsAttributeTemplateDirective,
    FsAttributeAutocompleteChipsStaticDirective
  ],
  entryComponents: [
    FsAttributeSelectorComponent,
    FsAttributeSelectorWithGroupsComponent,
    FsAttributeEditComponent,
    FsAttributeManageComponent,
  ],
  declarations: [
    FsAttributeComponent,
    FsAttributesComponent,
    FsAttributeFieldComponent,
    FsAttributeSelectorComponent,
    FsAttributeEditComponent,
    FsAttributeManageComponent,
    FsAttributeListComponent,
    FsAttributeSelectComponent,
    FsAttributeAutocompleteChipsComponent,
    FsAttributeComponentWrapperComponent,
    FsAttributeTreeComponent,
    FsAttributeFieldGroupsComponent,
    FsAttributeSelectorWithGroupsComponent,
    AttributeSearchComponent,
    FsAttributeAutocompleteComponent,
    FsAttributeListColumnDirective,
    FsAttributeTemplateDirective,
    FsAttributeAutocompleteChipsStaticDirective
  ]
})
export class FsAttributeModule {
  static forRoot(config?: FsAttributeConfig): ModuleWithProviders<FsAttributeModule> {
    return {
      ngModule: FsAttributeModule,
      providers: [
        { provide: FS_ATTRIBUTE_DEFAULT_CONFIG, useValue: config || {} },
        AttributesConfig,
      ]
    };
  }
}
