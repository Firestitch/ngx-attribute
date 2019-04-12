import {
  AttributeColor,
  AttributeImage,
  AttributeOrder,
  FsAttributeConfig
} from '@firestitch/attribute';
import { FlatItemNode } from '@firestitch/tree';
import { FsPrompt } from '@firestitch/prompt';

import { of } from 'rxjs';
import { filter, isEqual } from 'lodash-es';

import { ListVisibleComponent } from '../components/list-visible';
import { EditVisibleComponent } from '../components/edit-visible';
import { attributesStore } from './data';


export function attributeConfigFactory(prompt: FsPrompt): FsAttributeConfig {
  const config = {
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
            editComponent: EditVisibleComponent
          }
        ]
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
            editComponent: EditVisibleComponent
          }
        ],
      },
      {
        class: 'aroma',
        image: AttributeImage.Parent,
        // image: AttributeColor.Disabled,
        // backgroundColor: AttributeColor.Parent,
        // color: AttributeColor.Disabled,
        order: AttributeOrder.Alphabetical,
        name: 'Aroma (Child)',
        pluralName: 'Aromas',
      },

      {
        class: 'background-color',
        backgroundColor: AttributeColor.Enabled,
        name: 'Background Color',
        pluralName: 'Background Colors',
      }
    ],
    mapping: {
      id: 'id',
      name: 'name',
      image: 'image.small',
      backgroundColor: 'background_color',
      configs: 'configs',
      childAttributes: 'attributes',
      parentAttribute: 'parent_attribute'
    },
    getAttributeTree: (e) => {
      const data = attributesStore.filter((item) => item.class === e.class);

      return of({ attributes: data });
    },
    reorderAttributeTree: (event) => {
      console.log('reorderAttributeTree', event);
      return of();
    },

    canDropTreeAttribute: (
      node?: FlatItemNode,
      fromParent?: FlatItemNode,
      toParent?: FlatItemNode,
      dropPosition?: any,
      prevElement?: FlatItemNode,
      nextElement?: FlatItemNode
    ) => {
      return (!fromParent && !toParent) || (fromParent && toParent && fromParent.data.class === toParent.data.class);
    },
    sortByAttributeTree: (data) => {
      return data;
    },
    saveAttribute: (e) => {
      console.log('saveAttribute', e);

      if (!e.attribute.id) {
        e.attribute.id = attributesStore.length + 500;

        if (e.parent && e.parent.id) {
          const parent = attributesStore.find((attr) => attr.id === e.parent.id);
          if (parent) {
            const attrs = parent[config.mapping.childAttributes];
            if (!attrs || !Array.isArray(attrs)) {
              parent[config.mapping.childAttributes] = []
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
    saveAttributeImage: (e) => {
      console.log('saveAttributeImage', e);
      return of({ attribute: { image: { small: 'https://picsum.photos/200/300/?random' } } });
    },
    getAttributes: (e) => {
      console.log('getAttributes', e);

      let data = attributesStore.filter((item) => item.class === e.class);

      if (e.keyword) {
        data = filter(data, (attribute) => {
          return attribute.name.toLowerCase().indexOf(e.keyword) >= 0;
        });
      }

      return of({ data: data, paging: { records: data.length, limit: 10 } });
    },
    getSelectedAttributes: (e) => {
      console.log('getSelectedAttributes', e);
      const targetAttrs = attributesStore
        .filter((attribute) => attribute.class === e.parentClass)
        .reduce((acc, attribute) => {
          acc.push(...attribute[config.mapping.childAttributes]);

          return acc;
        }, []);
      console.log('tar', targetAttrs);

      let result = [];

      if (e.class === 'parent_type') {
        // const attrs = targetAttrs.reduce((acc, attr) => {
        //
        //   acc.push(...attr[config.mapping.childAttributes]);
        //
        //   return acc;
        // }, []);

        result = targetAttrs.slice();
      } else {
        result = targetAttrs.slice(1, 3);
      }

      return of({ data: result, paging: {} });
    },
    reorderAttributes: (e) => {
      console.log('reorderAttributes', e);
      // attributesStore = e.attributes;
      return of({ attributes: e.attributes });
    },
    attributeSelectionChanged: (e) => {
      console.log('attributeSelectionChanged', e);
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
    },
    deleteConfirmation: (event) => {
      return prompt.confirm({
        title: 'Confirm',
        template: `Sure?`
      })
    },
    compareAttributes(o1, o2) {
      return o1 && o2 && o1.id === o2.id;
    }
  };

  return config;
}
