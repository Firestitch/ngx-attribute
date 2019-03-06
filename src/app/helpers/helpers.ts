export function getAttributeValue(attribute, mapping) {
  if (!mapping) {
    return null;
  }
  return _getAttributeValue(attribute, mapping.split('.'));
}

export function _getAttributeValue(value, indexes) {
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
