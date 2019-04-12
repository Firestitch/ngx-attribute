import { CanDrop } from '@firestitch/tree/app/interfaces/config.interface';
import { Observable } from 'rxjs';

import { AttributeColor, AttributeImage, AttributeOrder } from '../enums/enums';

export interface FsAttributeConfig {
  configs?: AttributeConfig[]
  mapping?: {
    id: string,
    name: string,
    backgroundColor: string,
    image: string,
    childAttributes?: string
  }

  saveAttribute(e: any): Observable<{ attribute }>;

  deleteAttribute(e: any): Observable<{ attribute }>;
  deleteConfirmation(e: any): Observable<{ attribute }>;

  reorderAttributes(e: any): Observable<{ attributes }>

  sortByAttributeTree: (data: any[], parent?: any) => any[];
  canDropTreeAttribute: CanDrop,

  reorderAttributeTree(e: any): Observable<any>;

  getAttributes(e: any): Observable<{ data: any[], paging: any }>

  getAttributeTree(e: any): Observable<{ attributes }>

  attributeSelectionChanged(e: any): Observable<any>

  getSelectedAttributes(e: any): Observable<{ data: any[], paging: any }>

  saveAttributeImage(e: any): Observable<{ attribute }>

  compareAttributes(o1: any, o2: any): boolean
}

export interface AttributeConfig {
  class: string
  backgroundColor?: AttributeColor
  color?: AttributeColor,
  image?: AttributeImage
  // backgroundColor?: AttributeColor;
  // color?: AttributeColor;
  // image?: AttributeImage;
  name: string;
  pluralName: string;
  childClass?: string;
  order?: AttributeOrder;
  fields?: AttributeConfigField[];
  parentAttributes?: boolean;
}

export interface AttributeConfigField {
  label: string,
  listComponent?: any,
  editComponent?: any
}
