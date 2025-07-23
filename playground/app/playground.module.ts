import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FS_ATTRIBUTE_CONFIG, FsAttributeModule } from '@firestitch/attribute';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsChipModule } from '@firestitch/chip';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsMessageModule } from '@firestitch/message';
import { FsPrompt, FsPromptModule } from '@firestitch/prompt';
import { FsScrollModule } from '@firestitch/scroll';
import { FsSelectButtonModule } from '@firestitch/selectbutton';
import { FsSelectionModule } from '@firestitch/selection';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import {
  AttribtuesExampleComponent,
  AutocompleteChipsComponent,
  ConfigExampleComponent,
  EditVisibleComponent,
  ExamplesComponent,
  FieldExampleComponent,
  FieldWithGroupsExampleComponent,
  GroupSelectorExampleComponent,
  ListExampleComponent,
  ListVisibleComponent,
  SelectorExampleComponent,
  TreeExampleComponent,
} from './components';
import { attributeConfigFactory } from './helpers/attribute-config-factory';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsAttributeModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsSelectButtonModule,
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
    RouterModule.forRoot(routes, {}),
    FsColorPickerModule,
    FsLabelModule,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ConfigExampleComponent,
    FieldExampleComponent,
    FieldWithGroupsExampleComponent,
    ListExampleComponent,
    AttribtuesExampleComponent,
    AutocompleteChipsComponent,
    ListVisibleComponent,
    EditVisibleComponent,
    TreeExampleComponent,
    GroupSelectorExampleComponent,
    SelectorExampleComponent,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } },
    { provide: FS_ATTRIBUTE_CONFIG, useFactory: attributeConfigFactory, deps: [FsPrompt] },
  ],
})
export class PlaygroundModule {}

