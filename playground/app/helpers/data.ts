export const attributesStore = [
  {
    id: 1,
    class: 'everything',
    background_color: '#19A8E2',
    image: {
      small: '/assets/headshot2.jpg'
    },
    name: 'Attribute 1',
    configs: { visible_on_list: true }
  },
  {
    id: 2,
    class: 'everything',
    background_color: '#008A75',
    image: {
      small: '/assets/headshot3.jpg',
    },
    name: 'Attribute 2',
    configs: { visible_on_list: false }
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
    name: 'Attribute 4',
    configs: { visible_on_list: true }
  },

  // Tree
  {
    id: 5,
    class: 'aroma_type',
    background_color: '#19A8E2',
    image: {
      small: '/assets/headshot2.jpg'
    },
    name: 'Aroma Type 1',
    attributes: [
      {
        id: 6,
        class: 'aroma',
        name: 'Aroma 1',
      },
      {
        id: 7,
        class: 'aroma',
        name: 'Aroma 2'
      },
    ]
  },
  {
    id: 8,
    class: 'aroma_type',
    background_color: '#008A75',
    image: {
      small: '/assets/headshot3.jpg',
    },
    name: 'Aroma Type 2',
    attributes: [
      {
        id: 9,
        class: 'aroma',
        name: 'Aroma 3',
      },
      {
        id: 10,
        class: 'aroma',
        name: 'Aroma 4'
      },
    ]
  },

  // Tree with parents
  {
    id: 11,
    class: 'parent_type',
    image: {
      small: '/assets/headshot2.jpg'
    },
    name: 'Cherry',
    attributes: [
      {
        id: 12,
        class: 'child',
        name: 'Bing Cherries',
      },
      {
        id: 13,
        class: 'child',
        name: 'Cranberry'
      },
      {
        id: 14,
        class: 'child',
        name: 'Jam'
      },
    ]
  },
  {
    id: 15,
    class: 'parent_type',
    image: {
      small: '/assets/headshot3.jpg',
    },
    name: 'Floral',
    attributes: [
      {
        id: 16,
        class: 'child',
        name: 'Citrus Blossom',
      },
      {
        id: 17,
        class: 'child',
        name: 'Elderflower'
      },
    ]
  },
  {
    id: 18,
    class: 'parent_type',
    image: {
      small: '/assets/headshot4.jpg',
    },
    name: 'Earth',
    attributes: [
      {
        id: 19,
        class: 'child',
        name: 'Clay Pot',
      },
      {
        id: 20,
        class: 'child',
        name: 'Moss'
      },
    ]
  }
];
