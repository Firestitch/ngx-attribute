import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FS_ATTRIBUTE_CONFIG, FsAttributeModule } from '@firestitch/attribute';
import { attributeConfigFactory } from './app/helpers/attribute-config-factory';
import { FsPrompt, FsPromptModule } from '@firestitch/prompt';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsSelectButtonModule } from '@firestitch/selectbutton';
import { FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsChipModule } from '@firestitch/chip';
import { FsListModule } from '@firestitch/list';
import { FsScrollModule } from '@firestitch/scroll';
import { FsFileModule } from '@firestitch/file';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsSelectionModule } from '@firestitch/selection';
import { FsFormModule } from '@firestitch/form';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsLabelModule } from '@firestitch/label';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FsAttributeModule.forRoot(), FormsModule, FsSelectButtonModule, FsAutocompleteChipsModule.forRoot(), FsChipModule.forRoot(), FsListModule.forRoot(), FsScrollModule.forRoot(), FsFileModule.forRoot(), FsExampleModule.forRoot(), FsMessageModule.forRoot(), FsSelectionModule, FsFormModule.forRoot(), FsPromptModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true }), FsColorPickerModule, FsLabelModule),
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'auto' } },
        { provide: FS_ATTRIBUTE_CONFIG, useFactory: attributeConfigFactory, deps: [FsPrompt] },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

