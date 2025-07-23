import { CanDrop } from '@firestitch/tree';

import { Observable } from 'rxjs';

import { AttributeColor, AttributeImage, AttributeOrder } from '../enums/enums';
import { AttributeItem } from '../models';

export type AttributeConfigSaveAttribute = (
  event: {
  attribute: AttributeItem,
  class?: string,
  data?: any,
  parent?: any,
}) => Observable<{ attribute }>;
export type AttributeConfigDeleteAttribute = (e: any) => Observable<{ attribute }>;
export type AttributeConfigCompareAttribute = (o1: any, o2: any) => boolean;
export type AttributeConfigSaveAttributeImage = (e: any) => Observable<{ attribute }>;
export type AttributeConfigSortAttributeTree = (data: any[], parent?: any) => any[];
export type AttributeConfigCanDropTreeAttribute = CanDrop;
export type AttributeConfigReorderAttributeTree = (e: any) => Observable<any>;
export type AttributeConfigFetchAttributeTree = (e: any) => Observable<{ attributes }>;
export type AttributeConfigReorderAttributes = (e: any) => Observable<{ attributes }>;
export type AttributeConfigFetchAttributes = (e: AttributeConfigFetchAttributesData) => Observable<{ data: any[], paging: any }>;
export type AttributeConfigChangedSelectedAttributes = (e: any) => Observable<any>;
export type AttributeConfigFetchSelectedAttributes = (e: any) => Observable<{ data: any[], paging: any }>;

export interface AttributeConfigFetchAttributesData {
  class: string;
  query?: any;
  data?: any;
  keyword?: string;
}

export interface FsAttributeConfig {
  configs?: AttributeConfig[];
  mapping?: AttributeMappingConfig;

  saveAttribute?: AttributeConfigSaveAttribute;

  deleteAttribute?: AttributeConfigDeleteAttribute;
  compareAttributes?: AttributeConfigCompareAttribute;
  
  saveAttributeImage?: AttributeConfigSaveAttributeImage;

  sortByAttributeTree?: AttributeConfigSortAttributeTree;
  canDropTreeAttribute?: AttributeConfigCanDropTreeAttribute,
  reorderAttributeTree?: AttributeConfigReorderAttributeTree;
  getAttributeTree?: AttributeConfigFetchAttributeTree;

  getAttributes?: AttributeConfigFetchAttributes;
  reorderAttributes?: AttributeConfigReorderAttributes;

  attributeSelectionChanged?: AttributeConfigChangedSelectedAttributes;
  getSelectedAttributes?: AttributeConfigFetchSelectedAttributes;
 
  attributes?: {
    reorder?: AttributeConfigReorderAttributes;
    fetch?: AttributeConfigFetchAttributes;
  },

  attributeTree?: {
    reorder?: AttributeConfigReorderAttributeTree;
    fetch?: AttributeConfigFetchAttributeTree;
    sort?: AttributeConfigSortAttributeTree;
    canDrop?: AttributeConfigCanDropTreeAttribute,
  }

  attribute?: {
    save?: AttributeConfigSaveAttribute;
    delete?: AttributeConfigDeleteAttribute;
    compare?: AttributeConfigCompareAttribute;
  },

  attributeImage?: {
    save?: AttributeConfigSaveAttributeImage;
  }

  selectedAttributes?: {
    changed?: AttributeConfigChangedSelectedAttributes;
    fetch?: AttributeConfigFetchSelectedAttributes;
  }

}

export interface AttributeMappingConfig {
  id?: string,
  name?: string,
  backgroundColor?: string,
  image?: string,
  color?: string,
  state?: string,
  childAttributes?: string,
  parentAttribute?: string
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
  mapping?: AttributeMappingConfig
}

export interface AttributeConfigField {
  label: string,
  listComponent?: any,
  editComponent?: any
}
