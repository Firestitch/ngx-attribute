export interface FsAttributeConfig {
  configs?: AttributeConfig[],
}

export interface AttributeConfig {
  class: string
  backgroundColor?: boolean
  textColor?: boolean
  image?: boolean
}