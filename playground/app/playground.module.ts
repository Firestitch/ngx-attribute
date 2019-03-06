import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsColorPickerModule } from '@firestitch/colorpicker';
import { FsLabelModule } from '@firestitch/label';

import { ToastrModule } from 'ngx-toastr';
import { filter, isEqual } from 'lodash-es';

import { FsAttributeModule, AttributeOrder } from '@firestitch/package';

import { of } from 'rxjs';

import { AppMaterialModule } from './material.module';
import {
  ExampleComponent,
  ExamplesComponent,
  FieldExampleComponent,
  ConfigExampleComponent,
  ListExampleComponent
} from './components';
import { AppComponent } from './app.component';
import { FsSelectionModule } from '@firestitch/selection';
import { FsPromptModule } from '@firestitch/prompt';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

let attributes = [];

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
    ExampleComponent,
    ConfigExampleComponent,
    FieldExampleComponent,
    ListExampleComponent
  ],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } },
    { provide: 'sss', useFactory: attributeConfigFactory }
  ]
})
export class PlaygroundModule {}

export function attributeConfigFactory() {
  return {
    configs: [
      {
        class: 'everything',
        image: true,
        backgroundColor: true,
        textColor: true,
        name: 'Attribute',
        pluralName: 'Attributes',
        order: AttributeOrder.Custom
      },
      {
        class: 'background-color',
        backgroundColor: true,
        name: 'Background Color',
        pluralName: 'Background Colors',
      }
    ],
    attributeSave: (attribute) => {

      if (!attribute.id) {
        attribute.id = attributes.length + 2;
        attributes.push(attribute);
      }
    },
    attributesReorder: (data) => {
      attributes = data;
    },
    attributeImageSave: (attribute, file) => {

    },
    attributeDelete: (attribute) => {
      attributes.forEach((item, index) => {
        if (isEqual(attribute, item)) {
          attributes.splice(index, 1);
        }
      });
      return of(true);
    },
    attributesFetch: (query) => {

      if (!attributes.length) {
        attributes = [
          {
            id: 1,
            class: 'everything',
            backgroundColor: '#19A8E2',
            image: '/assets/headshot2.jpg',
            name: 'Attribute 1',
          },
          {
            id: 2,
            class: 'everything',
            backgroundColor: '#008A75',
            image: '/assets/headshot3.jpg',
            name: 'Attribute 2'
          },
          {
            id: 3,
            class: 'everything',
            backgroundColor: '#61b4c0',
            image: '/assets/headshot4.jpg',
            name: 'Attribute 3'
          },
          {
            id: 4,
            class: 'everything',
            backgroundColor: '#ffd204',
            image: '/assets/headshot5.jpg',
            name: 'Attribute 4'
          }
        ];
      }

      let filteredAttributes = attributes.splice(0);

      if (query.keyword) {
        filteredAttributes = filter(filteredAttributes, (attribute) => {
          return attribute.name.indexOf(query.keyword) >= 0;
        });
      }

      return of({ data: filteredAttributes, paging: { records: attributes.length, limit: 10 } });
    }
  };
}
