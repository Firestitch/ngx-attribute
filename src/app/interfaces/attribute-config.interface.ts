import { Observable } from "rxjs";

export interface FsAttributeConfig {
  configs?: AttributeConfig[]
  mapping?: { id: string, name: string, backgroundColor: string, image: string, childAttributes?: string }
  saveAttribute(e: any): Observable<{ attribute }>
  saveAttributeTree(e: any): Observable<{ attributes }>
  deleteAttribute(e: any): Observable<{ attribute }>
  reorderAttributes(e: any): Observable<{ attributes }>
  reorderAttributeTree(e: any): Observable<any>
  getAttributes(e: any): Observable<{ data: [], paging: {} }>
  getAttributeTree(e: any): Observable<{ attributes }>
  attributeSelectionChanged(e: any): Observable<any>
  getSelectedAttributes(e: any): Observable<{ data: [], paging: {} }>
  saveAttributeImage(e: any): Observable<{ attribute }>
  compareAttributes(o1: any, o2: any): boolean
}

export enum AttributeOrder {
  Custom,
  Alphabetical
}

export enum AttributeColor {
  Enabled,
  Disabled,
  Parent
}

export enum AttributeImage {
  Enabled,
  Disabled,
  Parent
}

export interface AttributeConfig {
  class: string
  backgroundColor?: boolean
  color?: boolean
  image?: boolean
  //backgroundColor?: AttributeColor
  //color?: AttributeColor
  //image?: AttributeImage
  name: string
  pluralName: string
  order?: AttributeOrder
  fields?: AttributeConfigField[],
  parentAttributes?: boolean
}

export interface AttributeConfigField {
  label: string,
  listComponent: any,
  editComponent: any
}
