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
import { filter, isEqual, clone } from 'lodash-es';

import { FsAttributeModule, AttributeOrder, FsAttributeConfig, FS_ATTRIBUTE_CONFIG } from '@firestitch/package';

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

let attributesStore = [
  {
    id: 1,
    class: 'everything',
    background_color: '#19A8E2',
    image: {
      small: '/assets/headshot2.jpg'
    },
    name: 'Attribute 1',
  },
  {
    id: 2,
    class: 'everything',
    background_color: '#008A75',
    image: {
      small: '/assets/headshot3.jpg',
    },
    name: 'Attribute 2'
  },
  {
    id: 3,
    class: 'everything',
    background_color: '#61b4c0',
    image: {
      small: '/assets/headshot4.jpg',
    },
    name: 'Attribute 3'
  },
  {
    id: 4,
    class: 'everything',
    background_color: '#ffd204',
    image: {
      small: '/assets/headshot5.jpg',
    },
    name: 'Attribute 4'
  }
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
    ExampleComponent,
    ConfigExampleComponent,
    FieldExampleComponent,
    ListExampleComponent
  ],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } },
    { provide: FS_ATTRIBUTE_CONFIG, useFactory: attributeConfigFactory, deps: [] }
  ]
})
export class PlaygroundModule {}

export function attributeConfigFactory(): FsAttributeConfig {
  return {
    configs: [
      {
        class: 'everything', //type
        image: true,
        backgroundColor: true,
        color: true,
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
    mapping: {
      id: 'id',
      name: 'name',
      image: 'image.small',
      backgroundColor: 'background_color'
    },
    saveAttribute: (e) => {
      console.log('saveAttribute', e);
      // if(!attribute.state){
      //   attribute.state = 'draft';
      // }

      // if (attribute.state==='draft') {
      //   attribute.state = 'active';
      // }
      // attributeService.save()

      if (!e.attribute.id) {
        e.attribute.id = attributesStore.length + 2;
        attributesStore.push(e.attribute);
      }

      return of({ attribute: e.attribute });
    },
    getAttributes: (e) => {
      console.log('getAttributes', e);

      let filteredAttributes = clone(attributesStore);

      if (e.query && e.query.keyword) {
        filteredAttributes = filter(filteredAttributes, (attribute) => {
          return attribute.name.indexOf(e.query.keyword) >= 0;
        });
      }

      return of({ data: filteredAttributes, paging: { records: attributesStore.length, limit: 10 } });
    },
    getSelectedAttributes: (e) => {
      console.log('getSelectedAttributes', e);
      return of({ data: clone(attributesStore).splice(1, 3), paging: {} });
    },
    reorderAttributes: (e) => {
      console.log('reorderAttributes', e);
      attributesStore = e.attributes;
      return of({ attributes: e.attributes });
    },
    attributeSelectionChanged: (e) => {
      console.log('attributeSelectionChanged', e);
      return of({ attribute: e.attribute });
    },
    saveAttributeImage: (e) => {
      console.log('saveAttributeImage', e);
      return of({ attribute: e.attribute });
    },
    deleteAttribute: (e) => {
      console.log('deleteAttribute', e);
      attributesStore.forEach((item, index) => {
        if (isEqual(e.attribute, item)) {
          attributesStore.splice(index, 1);
        }
      });
      return of({ attribute: e.attribute });
    }
  };
}
