import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FsAttributeComponent } from './components/attribute/attribute.component';
import { FsAttributeChipComponent } from './components/attribute-chip/attribute-chip.component';
import { FsAttributeFieldComponent } from './components/attribute-field/attribute-field.component';
import { FsAttributesFieldComponent } from './components/attributes/attributes.component';
import { FsAttributeSelectorComponent } from './components/attribute-selector/attribute-selector.component';
import { FsAttributeEditComponent } from './components/attribute-edit/attribute-edit.component';
import { FsAttributeManageComponent } from './components/attribute-manage/attribute-manage.component';
import { FsAttributeListComponent } from './components/attribute-list/attribute-list.component';

import {  MatChipsModule, MatIconModule, MatDialogModule,
          MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG, FS_ATTRIBUTE_DEFAULT_CONFIG } from './providers';
import { FsAttributeConfig } from './interfaces/attribute-config.interface';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsFormModule } from '@firestitch/form';
import { FsListModule } from '@firestitch/list';

import { merge } from 'lodash-es';
import { FsScrollModule } from '@firestitch/scroll';
import { FsFileModule } from '@firestitch/file';


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
    FsColorPickerModule,
    FsFormModule,
    FsListModule.forRoot(),
    FsScrollModule.forRoot(),
    FsFileModule.forRoot()
  ],
  exports: [
    FsAttributeComponent,
    FsAttributeFieldComponent,
    FsAttributeListComponent
  ],
  entryComponents: [
    FsAttributeSelectorComponent,
    FsAttributeEditComponent,
    FsAttributeManageComponent
  ],
  declarations: [
    FsAttributeComponent,
    FsAttributeChipComponent,
    FsAttributeFieldComponent,
    FsAttributesFieldComponent,
    FsAttributeSelectorComponent,
    FsAttributeEditComponent,
    FsAttributeManageComponent,
    FsAttributeListComponent
  ]
})
export class FsAttributeModule {
  static forRoot(config: FsAttributeConfig = {}): ModuleWithProviders {
    return {
      ngModule: FsAttributeModule,
      providers: [
        { provide: FS_ATTRIBUTE_DEFAULT_CONFIG, useValue: config },
        {
          provide: FS_ATTRIBUTE_CONFIG,
          useFactory: FsAttributeConfigFactory,
          deps: [FS_ATTRIBUTE_DEFAULT_CONFIG, 'sss']
        }
      ]
    };
  }
}

export function FsAttributeConfigFactory(config: FsAttributeConfig, configProvider: FsAttributeConfig) {

  return merge(configProvider, config);
}


