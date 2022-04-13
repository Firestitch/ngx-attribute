import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsLabelModule } from '@firestitch/label';
import { FsAttributeModule, FS_ATTRIBUTE_CONFIG } from '@firestitch/attribute';
import { FsSelectionModule } from '@firestitch/selection';
import { FsPrompt, FsPromptModule } from '@firestitch/prompt';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsChipModule } from '@firestitch/chip';
import { FsListModule } from '@firestitch/list';
import { FsScrollModule } from '@firestitch/scroll';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsSelectButtonModule } from '@firestitch/selectbutton';
import { FsAutocompleteModule } from '@firestitch/autocomplete';

import { ToastrModule } from 'ngx-toastr';

import { attributeConfigFactory } from './helpers/attribute-config-factory';
import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent,
  FieldExampleComponent,
  ConfigExampleComponent,
  ListExampleComponent,
  AttribtuesExampleComponent,
  AutocompleteChipsComponent,
  AutocompleteComponent,
  ListVisibleComponent,
  EditVisibleComponent,
  SelectFieldExampleComponent,
  TreeExampleComponent,
  FieldWithGroupsExampleComponent,
  GroupSelectorExampleComponent,
  SelectorExampleComponent
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
    FsSelectButtonModule,
    FsAutocompleteModule,
    FsAutocompleteChipsModule.forRoot(),
    FsChipModule.forRoot(),
    FsListModule.forRoot(),
    FsScrollModule.forRoot(),
    FsFileModule.forRoot(),
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    FsSelectionModule,
    FsFormModule.forRoot(),
    FsPromptModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    FsColorPickerModule,
    FsLabelModule
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ConfigExampleComponent,
    FieldExampleComponent,
    FieldWithGroupsExampleComponent,
    ListExampleComponent,
    AttribtuesExampleComponent,
    SelectFieldExampleComponent,
    AutocompleteChipsComponent,
    ListVisibleComponent,
    EditVisibleComponent,
    TreeExampleComponent,
    AutocompleteComponent,
    GroupSelectorExampleComponent,
    SelectorExampleComponent,
  ],
  entryComponents: [
    ListVisibleComponent,
    EditVisibleComponent,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } },
    { provide: FS_ATTRIBUTE_CONFIG, useFactory: attributeConfigFactory, deps: [ FsPrompt ] }
  ]
})
export class PlaygroundModule {}

