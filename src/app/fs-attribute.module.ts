import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsAttributeComponent } from './components/attribute/attribute.component';
import { FsAttributeChipComponent } from './components/attribute-chip/attribute-chip.component';
import { MatChipsModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule
  ],
  exports: [
    FsAttributeComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsAttributeComponent,
    FsAttributeChipComponent
  ]
})
export class FsAttributeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsAttributeModule
    };
  }
}
