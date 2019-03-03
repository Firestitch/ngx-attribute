import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsAttributeComponent } from './components/attribute/attribute.component';
import { FsAttributeChipComponent } from './components/attribute-chip/attribute-chip.component';
import { FsAttributeFieldComponent } from './components/attribute-field/attribute-field.component';
import { FsAttributesFieldComponent } from './components/attributes/attributes.component';
import { FsAttributeSelectorComponent } from './components/attribute-selector/attribute-selector.component';
import { MatChipsModule, MatIconModule, MatDialogModule, MatButtonModule } from '@angular/material';

import { FS_ATTRIBUTE_CONFIG, FS_ATTRIBUTE_DEFAULT_CONFIG } from './providers';
import { FsAttributeConfig } from './interfaces/attribute-config.interface';

import { merge } from 'lodash-es';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    FsAttributeComponent,
    FsAttributeFieldComponent
  ],
  entryComponents: [
    FsAttributeSelectorComponent
  ],
  declarations: [
    FsAttributeComponent,
    FsAttributeChipComponent,
    FsAttributeFieldComponent,
    FsAttributesFieldComponent,
    FsAttributeSelectorComponent
  ]
})
export class FsAttributeModule {
  static forRoot(config: FsAttributeConfig = {}): ModuleWithProviders {
    return {
      ngModule: FsAttributeModule,
      providers: [
        { provide: FS_ATTRIBUTE_CONFIG, useValue: config },
        {
          provide: FS_ATTRIBUTE_DEFAULT_CONFIG,
          useFactory: FsAttributeConfigFactory,
          deps: [FS_ATTRIBUTE_CONFIG]
        }
      ]
    };
  }
}

export function FsAttributeConfigFactory(config: FsAttributeConfig) {
  return merge({}, config);
}


