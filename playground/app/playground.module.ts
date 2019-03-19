import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsLabelModule } from '@firestitch/label';
import { FsAttributeModule, FS_ATTRIBUTE_CONFIG } from '@firestitch/attribute';
import { FsSelectionModule } from '@firestitch/selection';
import { FsPromptModule } from '@firestitch/prompt';

import { ToastrModule } from 'ngx-toastr';

import { attributeConfigFactory } from './helpers/attribute-config-factory';
import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent,
  FieldExampleComponent,
  ConfigExampleComponent,
  ListExampleComponent,
  AttribtuesExampleComponent,
  AutocompleteFieldExampleComponent,
  ListVisibleComponent,
  EditVisibleComponent,
  SelectFieldExampleComponent
} from './components';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsAttributeModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    FsSelectionModule.forRoot(),
    FsPromptModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
    FsColorPickerModule,
    FsLabelModule
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ConfigExampleComponent,
    FieldExampleComponent,
    ListExampleComponent,
    AttribtuesExampleComponent,
    SelectFieldExampleComponent,
    AutocompleteFieldExampleComponent,
    ListVisibleComponent,
    EditVisibleComponent
  ],
  entryComponents: [
    ListVisibleComponent,
    EditVisibleComponent,
  ],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } },
    { provide: FS_ATTRIBUTE_CONFIG, useFactory: attributeConfigFactory, deps: [] }
  ]
})
export class PlaygroundModule {}

