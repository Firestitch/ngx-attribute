import { Observable } from "rxjs";

export interface FsAttributeConfig {
  configs?: AttributeConfig[],
  saveAttribute(e: any): Observable<{ attribute }>;
  deleteAttribute(e: any): Observable<{ attribute }>;
  reorderAttributes(e: any): Observable<{ attributes: [] }>;
  getAttributes(e: any): Observable<{ data: [], paging: {} }>;
  attributeSelectionChanged(e: any): Observable<any>;
  getSelectedAttributes(e: any): Observable<{ data: [], paging: {} }>;
  saveAttributeImage(e: any): Observable<{ attribute }>;
  mapping?: { id: string, name: string, backgroundColor: string, image: string }
}

export enum AttributeOrder {
  Custom
}

export interface AttributeConfig {
  class: string
  backgroundColor?: boolean
  color?: boolean
  image?: boolean,
  name: string,
  pluralName: string,
  order?: AttributeOrder
}