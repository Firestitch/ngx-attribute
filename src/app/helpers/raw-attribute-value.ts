import { AttributeItem } from '../models/attribute';


export function getRawAttributeValue(value) {
  if (value) {
    if (value instanceof AttributeItem) {
      return value.toJSON();
    } else {
      return value;
    }
  }

  return null;
}
