import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';

import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsFormModule } from '@firestitch/form';
import { FsListModule } from '@firestitch/list';

import { FsScrollModule } from '@firestitch/scroll';
import { FsFileModule } from '@firestitch/file';
import { FsLabelModule } from '@firestitch/label';
import { FsChipModule } from '@firestitch/chip';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsTreeModule } from '@firestitch/tree';

import { FsAttributeComponent } from './components/attribute/attribute.component';
import { FsAttributeFieldComponent } from './components/attribute-field/attribute-field.component';
import { FsAttributesComponent } from './components/attributes/attributes.component';
import { FsAttributeSelectorComponent } from './components/attribute-selector/attribute-selector.component';
import { FsAttributeEditComponent } from './components/attribute-edit/attribute-edit.component';
import { FsAttributeManageComponent } from './components/attribute-manage/attribute-manage.component';
import { FsAttributeListComponent } from './components/attribute-list/attribute-list.component';
import { FsAttributeSelectComponent } from './components/attribute-select/attribute-select.component';
import { FsAttributeAutocompleteComponent } from './components/attribute-autocomplete/attribute-autocomplete.component';
import { FsAttributeComponentWrapperComponent } from './components/attribute-list/component-wrapper/component-wrapper.component';
import { FsAttributeTreeComponent } from './components/attribute-tree/attribute-tree.component';
import { FsAttributeFieldGroupsComponent } from './components/attribute-field-groups/attribute-field-groups.component';
import { FsAttributeTreeSelectorComponent } from './components/attribute-field-groups/selector/selector.component';

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
  ],
  exports: [
    FsAttributeComponent,
    FsAttributesComponent,
    FsAttributeFieldComponent,
    FsAttributeListComponent,
    FsAttributeSelectComponent,
    FsAttributeAutocompleteComponent,
    FsAttributeTreeComponent,
    FsAttributeFieldGroupsComponent,
  ],
  entryComponents: [
    FsAttributeSelectorComponent,
    FsAttributeTreeSelectorComponent,
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
    FsAttributeAutocompleteComponent,
    FsAttributeComponentWrapperComponent,
    FsAttributeTreeComponent,
    FsAttributeFieldGroupsComponent,
    FsAttributeTreeSelectorComponent,
  ]
})
export class FsAttributeModule {
  static forRoot(config?: FsAttributeConfig): ModuleWithProviders {
    return {
      ngModule: FsAttributeModule,
      providers: [
        { provide: FS_ATTRIBUTE_DEFAULT_CONFIG, useValue: config || {} },
        AttributesConfig,
      ]
    };
  }
}
