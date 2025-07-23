import {
  AttributeColor,
  AttributeImage,
  AttributeOrder,
  FsAttributeConfig,
} from '@firestitch/attribute';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { filter, isEqual } from 'lodash-es';

import { EditVisibleComponent } from '../components/edit-visible';
import { ListVisibleComponent } from '../components/list-visible';

import { attributesStore } from './data';


export function attributeConfigFactory(): FsAttributeConfig {
  const config: FsAttributeConfig = {
    configs: [
      {
        class: 'person', // type
        image: AttributeImage.Enabled,
        backgroundColor: AttributeColor.Enabled,
        color: AttributeColor.Enabled,
        name: 'Person',
        pluralName: 'People',
        order: AttributeOrder.Custom,
        fields: [
          {
            label: 'Visible on List',
            listComponent: ListVisibleComponent,
            editComponent: EditVisibleComponent,
          },
        ],
      },
      {
        class: 'aroma_type',
        image: AttributeImage.Enabled,
        backgroundColor: AttributeColor.Enabled,
        // color: AttributeColor.Disabled,
        order: AttributeOrder.Custom,
        name: 'Aroma Type (Parent)',
        pluralName: 'Aroma Types',
        childClass: 'aroma',
        fields: [
          {
            label: 'Visible on List',
            listComponent: ListVisibleComponent,
            editComponent: EditVisibleComponent,
          },
        ],
      },
      {
        class: 'aroma',
        image: AttributeImage.Parent,
        // image: AttributeColor.Disabled,
        // backgroundColor: AttributeColor.Parent,
        // color: AttributeColor.Disabled,
        order: AttributeOrder.Alphabetical,
        selectedOrder: true,
        name: 'Aroma (Child)',
        pluralName: 'Aromas',
      },

      {
        class: 'background-color',
        backgroundColor: AttributeColor.Enabled,
        name: 'Background Color',
        pluralName: 'Background Colors',
      },
    ],
    mapping: {
      id: 'id',
      name: 'name',
      image: 'image.small',
      backgroundColor: 'backgroundColor',
      childAttributes: 'attributes',
    },
    attribute: {
      save: (e) => {
        console.log('saveAttribute', e);

        if (!e.attribute.id) {
          e.attribute.id = attributesStore.length + 500;
  
          if (e.parent && e.parent.id) {
            const parent = attributesStore.find((attr) => attr.id === e.parent.id);
            if (parent) {
              const attrs = parent[config.mapping.childAttributes];
              if (!attrs || !Array.isArray(attrs)) {
                parent[config.mapping.childAttributes] = [];
              }
  
              parent[config.mapping.childAttributes].push(e.attribute);
            }
          }
          attributesStore.push(e.attribute);
        } else {
          const index = attributesStore.findIndex((attr) => attr.id === e.attribute.id);
  
          if (index !== -1) {
            attributesStore[index] = e.attribute;
          }
        }
  
        return of({ attribute: e.attribute });
      },
      delete: (e) => {
        console.log('deleteAttribute', e);
        attributesStore.forEach((item, index) => {
          if (isEqual(e.attribute, item)) {
            attributesStore.splice(index, 1);
          }
        });
  
        return of({ attribute: e.attribute });
      },
      compare: (o1, o2) => {
        return o1 && o2 && o1.id === o2.id;
      },
    },
    attributeTree: {
      reorder: (e) => {
        console.log('reorderAttributeTree', e);

        return of();
      },
      sort: (data) => {
        console.log('sortAttributeTree', data);

        return data;
      },
      canDrop: (node, fromParent, toParent, dropPosition, prevElement, nextElement) => {
        return (!fromParent && !toParent) || (fromParent && toParent && fromParent.data.class === toParent.data.class);
      },
      fetch: (e) => {
        const data = attributesStore.filter((item) => item.class === e.class);

        return of({ attributes: data });
      },
    },
    attributes: {
      fetch: (e) => {
        console.log('getAttributes', e);

        let data = attributesStore.filter((item) => item.class === e.class);
  
        if (e.keyword) {
          data = filter(data, (attribute) => {
            return attribute.name.toLowerCase().indexOf(e.keyword) >= 0;
          });
        }
  
        return of({ data: data, paging: { records: data.length, limit: 10 } });
      },
      reorder: (e) => {
        console.log('reorderAttributes', e);

        return of({ attributes: e.attributes });
      },
    },
    selectedAttributes: {
      changed: (e) => {
        console.log('attributeSelectionChanged', e);

        return of({ attribute: e.attribute });
      },
      fetch: (e) => {
        console.log('getSelectedAttributes', e);
        const targetAttrs = attributesStore
          .filter((attribute) => attribute.class === e.parentClass)
          .reduce((acc, attribute) => {
            acc.push(...attribute[config.mapping.childAttributes]);
  
            return acc;
          }, []);
        console.log('tar', targetAttrs);
  
        let result = [];
  
        result = e.class === 'parent_type' ? targetAttrs.slice() : targetAttrs.slice(1, 3);
  
        return of({ data: result, paging: {} });
      },
    },
    attributeImage: {
      save: (e) => {
        console.log('saveAttributeImage', e);

        return of({ attribute: { image: { small: 'https://picsum.photos/200/300/?random' } } })
          .pipe(delay(4000));
      },
    },
  };

  return config;
}
