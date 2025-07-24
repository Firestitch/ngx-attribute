import { AttributeModel } from '../models/attribute';


export function getRawAttributeValue(value) {
  if (value) {
    if (value instanceof AttributeModel) {
      return value.toJSON();
    }
 
    return value;
    
  }

  return null;
}
