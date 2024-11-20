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
