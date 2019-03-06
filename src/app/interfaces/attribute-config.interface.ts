export interface FsAttributeConfig {
  configs?: AttributeConfig[],
  attributeSave?: Function,
  attributeDelete?: Function,
  attributeImageSave?: Function,
  attributesReorder?: Function,
  attributesFetch?: Function,
}

export enum AttributeOrder {
  Custom
}

export interface AttributeConfig {
  class: string
  backgroundColor?: boolean
  textColor?: boolean
  image?: boolean,
  name: string,
  pluralName: string,
  order?: AttributeOrder
}