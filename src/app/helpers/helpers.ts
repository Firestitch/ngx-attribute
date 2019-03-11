export function getAttributeValue(attribute, mapping): any {
  if (!mapping) {
    return null;
  }
  return _getAttributeValue(attribute, mapping.split('.'));
}

export function _getAttributeValue(value, indexes): any {
  const index = indexes.shift(indexes);

  if (!index) {
    return value;
  }

  if (!value) {
    return value;
  }

  value = value[index];

  return _getAttributeValue(value, indexes);
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
