import { AttributeOrder, FsAttributeConfig, AttributeColor } from "@firestitch/package";
import { filter, isEqual, clone } from 'lodash-es';
import { of } from 'rxjs';
import { ListVisibleComponent } from "../components/list-visible";
import { EditVisibleComponent } from "../components/edit-visible";

let attributeTree = [
  {
    id: 1,
    class: 'aroma_type',
    background_color: '#19A8E2',
    image: {
      small: '/assets/headshot2.jpg'
    },
    name: 'Aroma Type 1',
    attributes: [
      {
        id: 3,
        class: 'aroma',
        name: 'Aroma 1',
      },
      {
        id: 4,
        class: 'aroma',
        name: 'Aroma 2'
      },
    ]
  },
  {
    id: 2,
    class: 'aroma_type',
    background_color: '#008A75',
    image: {
      small: '/assets/headshot3.jpg',
    },
    name: 'Aroma Type 2',
    attributes: [
      {
        id: 5,
        class: 'aroma',
        name: 'Aroma 3',
      },
      {
        id: 6,
        class: 'aroma',
        name: 'Aroma 4'
      },
    ]
  },

]


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

export function attributeConfigFactory(): FsAttributeConfig {
  return {
    configs: [
      {
        class: 'everything', //type
        image: true,
        backgroundColor: true,
        color: true,
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
        //image: AttributeColor.Enabled,
        //backgroundColor: AttributeColor.Enabled,
        //color: AttributeColor.Disabled,
        order: AttributeOrder.Custom,
        name: 'Aroma Type',
        pluralName: 'Aroma Types',
      },
      {
        class: 'aroma',
        //image: AttributeColor.Disabled,
        //backgroundColor: AttributeColor.Parent,
        //color: AttributeColor.Disabled,
        order: AttributeOrder.Alphabetical,
        name: 'Aroma',
        pluralName: 'Aromas',
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
    getAttributeTree: (e) => {

      console.log('getAttributeTree', e);
      return of({ attributes: [] });
    },
    saveAttributeTree: (e) => {
      console.log('saveAttributeTree', e);
      return of({ attributes: attributeTree });
    },
    reorderAttributeTree: (e) => {

      // e.attribute <-parent attributes which has the children attribites (e.attribute.attributes)
      console.log('reorderAttributeTree', e);
      return of();
    },
    saveAttribute: (e) => {
      console.log('saveAttribute', e);

      if (!e.attribute.id) {
        e.attribute.id = attributesStore.length + 2;
        attributesStore.push(e.attribute);
      }

      return of({ attribute: e.attribute });
    },
    saveAttributeImage: (e) => {
      e.attribute.image = { small: 'https://picsum.photos/200/300/?random' };
      console.log('saveAttributeImage', e);
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
    deleteAttribute: (e) => {
      console.log('deleteAttribute', e);
      attributesStore.forEach((item, index) => {
        if (isEqual(e.attribute, item)) {
          attributesStore.splice(index, 1);
        }
      });
      return of({ attribute: e.attribute });
    },
    compareAttributes(o1, o2) {
      return o1 && o2 && o1.id === o2.id;
    }
  };
}
