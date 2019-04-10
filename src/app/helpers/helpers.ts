import { get as _get, set as _set } from 'lodash-es';

export function getAttributeValue(attribute, mapping): any {
  if (!mapping) {
    return null;
  }

  return _get(attribute, mapping);
}

export function setAttributeValue(attribute, mapping, value): any {
  if (!mapping) {
    return null;
  }

  return _set(attribute, mapping, value);
}

export function wrapAttributes(fsAttributeConfig, items) {
  const attributes = [];
  const mapping = fsAttributeConfig.mapping;
  items.forEach(item => {
    attributes.push(
      {
        id: getAttributeValue(item, mapping.id),
        name: getAttributeValue(item, mapping.name),
        backgroundColor: getAttributeValue(item, mapping.backgroundColor),
        image: getAttributeValue(item, mapping.image),
        attribute: item
      });
  });
  return attributes;
}
