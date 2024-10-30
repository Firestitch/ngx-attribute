import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FsAutocompleteModule } from '@firestitch/autocomplete';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsChipModule } from '@firestitch/chip';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsMenuModule } from '@firestitch/menu';
import { FsScrollModule } from '@firestitch/scroll';
import { FsTreeModule } from '@firestitch/tree';

import { FsAttributeAutocompleteChipsComponent } from './components/attribute-autocomplete-chips/attribute-autocomplete-chips.component';
import { FsAttributeAutocompleteComponent } from './components/attribute-autocomplete/attribute-autocomplete.component';
import { FsAttributeEditComponent } from './components/attribute-edit/attribute-edit.component';
import { FsAttributeFieldGroupsComponent } from './components/attribute-field-groups/attribute-field-groups.component';
import { FsAttributeFieldComponent } from './components/attribute-field/attribute-field.component';
import { FsAttributeListComponent } from './components/attribute-list/attribute-list.component';
import { FsAttributeComponentWrapperComponent } from './components/attribute-list/component-wrapper/component-wrapper.component';
import { FsAttributeManageComponent } from './components/attribute-manage/attribute-manage.component';
import { FsAttributeSelectComponent } from './components/attribute-select/attribute-select.component';
import { FsAttributeSelectorComponent } from './components/attribute-selector/attribute-selector.component';
import { FsAttributeTreeComponent } from './components/attribute-tree/attribute-tree.component';
import { FsAttributeComponent } from './components/attribute/attribute.component';
import { FsAttributesComponent } from './components/attributes/attributes.component';
import { AttributeSearchComponent } from './components/search/search.component';
import { FsAttributeSelectorWithGroupsComponent } from './components/selector-with-groups/selector-with-groups.component';
import { FsAttributeAutocompleteChipsStaticDirective } from './directives/attribute-autocomplete-chips-static.component';
import { FsAttributeTemplateDirective } from './directives/attribute-template.component';
import { FsAttributeListColumnDirective } from './directives/list-column.directive';
import { FsAttributeConfig } from './interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_DEFAULT_CONFIG } from './providers';
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
    FsAttributeAutocompleteChipsStaticDirective,
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
    FsAttributeAutocompleteChipsStaticDirective,
  ],
})
export class FsAttributeModule {
  public static forRoot(config?: FsAttributeConfig): ModuleWithProviders<FsAttributeModule> {
    return {
      ngModule: FsAttributeModule,
      providers: [
        { provide: FS_ATTRIBUTE_DEFAULT_CONFIG, useValue: config || {} },
        AttributesConfig,
      ],
    };
  }
}
