import { AttributeColor, AttributeImage, AttributeOrder } from '../enums/enums';
import { AttributeConfig, AttributeMappingConfig } from '../interfaces';

export class AttributeConfigModel {
  
  public parent: AttributeConfigModel;
  public child: AttributeConfigModel;
  public hasEditableImage: boolean;
  private _class;
  private _childClass: string;
  private _image: AttributeImage;
  private _backgroundColor: AttributeColor;
  private _color: AttributeColor;
  private _name: string;
  private _pluralName: string;
  private _order: AttributeOrder;
  private _selectedOrder: boolean;
  private _fields: any[];
  private _mapping: AttributeMappingConfig = {};

  public get class() {
    return this._class;
  }

  public get childClass(): string {
    return this._childClass;
  }

  public get image(): AttributeImage {
    return this._image;
  }

  public get backgroundColor(): AttributeColor {
    return this._backgroundColor;
  }

  public  get color(): AttributeColor {
    return this._color;
  }

  public get name(): string {
    return this._name;
  }

  public get pluralName(): string {
    return this._pluralName;
  }

  public get order(): AttributeOrder {
    return this._order;
  }

  public get selectedOrder(): boolean {
    return this._selectedOrder;
  }

  public get fields(): any[] {
    return this._fields || [];
  }

  public get mapping(): AttributeMappingConfig {
    return this._mapping;
  }

  public get hasImage(): boolean {
    return this._image === AttributeImage.Enabled;
  }

  public get hasNestedImage(): boolean {
    return this._image === AttributeImage.Parent;
  }

  constructor(config: AttributeConfig) {
    this._initConfig(config);
  }

  private _initConfig(config: AttributeConfig) {
    this._class = config.class;
    this._childClass = config.childClass;
    this._image = config.image ?? AttributeImage.Disabled;
    this._color = config.color ?? AttributeColor.Disabled;
    this._backgroundColor = config.backgroundColor ?? AttributeColor.Disabled;
    this._name = config.name;
    this._pluralName = config.pluralName;
    this._order = config.order;
    this._selectedOrder = config.selectedOrder;
    this.hasEditableImage = this._image === AttributeImage.Enabled;
    this._fields = Array.isArray(config.fields) ? config.fields.slice() : config.fields;
    this._mapping = {
      id: 'id',
      name: 'name',
      backgroundColor: 'backgroundColor',
      image: 'image',
      color: 'color',
      state: 'state',
      ...config.mapping,
    };
  }
}
