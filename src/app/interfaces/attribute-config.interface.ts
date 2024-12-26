import { CanDrop } from '@firestitch/tree';

import { Observable } from 'rxjs';

import { AttributeColor, AttributeImage, AttributeOrder } from '../enums/enums';
import { AttributeItem } from '../models';

export interface FsAttributeConfig {
  configs?: AttributeConfig[];
  apiPath?: string;
  mapping?: {
    id: string,
    name: string,
    backgroundColor: string,
    image: string,
    childAttributes?: string
  };

  saveAttribute?: (
    event: {
    attribute: AttributeItem,
    class?: string,
    data?: any,
    parent?: any,
  })=> Observable<{ attribute }>;

  deleteAttribute?: (e: any)=> Observable<{ attribute }>;
  deleteConfirmation?: (attributeItem: AttributeItem) =>Observable<{ attribute }>;
  reorderAttributes?: (e: any) => Observable<{ attributes }>
  sortByAttributeTree?: (data: any[], parent?: any) => any[];
  canDropTreeAttribute?: CanDrop,
  reorderAttributeTree?: (e: any) => Observable<any>;
  getAttributes?: (e: { 
    class: string,
    query?: any,
    data?: any,
    keyword?: string,
   }) => Observable<{ data: any[], paging: any }>;
  getAttributeTree?: (e: any) => Observable<{ attributes }>;
  attributeSelectionChanged?: (e: any) => Observable<any>;
  getSelectedAttributes?: (e: any) => Observable<{ data: any[], paging: any }>;
  saveAttributeImage?: (e: any) => Observable<{ attribute }>;
  compareAttributes?: (o1: any, o2: any) => boolean;
}

export interface AttributeConfig {
  class: string
  backgroundColor?: AttributeColor
  color?: AttributeColor,
  image?: AttributeImage;
  name: string;
  pluralName: string;
  childClass?: string;
  order?: AttributeOrder;
  selectedOrder?: boolean;
  fields?: AttributeConfigField[];
  parentAttributes?: boolean;
  mapping?: {
    id: string,
    name: string,
    backgroundColor: string,
    image: string,
    childAttributes?: string
  }
}

export interface AttributeConfigField {
  label: string,
  listComponent?: any,
  editComponent?: any
}
