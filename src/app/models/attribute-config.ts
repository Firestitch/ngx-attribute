import { AttributeColor, AttributeImage, AttributeOrder } from '../enums/enums';

export class AttributeConfigItem {
  
  public parent: AttributeConfigItem;
  public child: AttributeConfigItem;

  public hasEditableImage: boolean;

  private _class;
  private _childClass: string;
  private _image;
  private _backgroundColor: AttributeColor;
  private _color: AttributeColor;
  private _name: string;
  private _pluralName: string;
  private _order: AttributeOrder;
  private _selectedOrder: boolean;
  private _fields: any[];
  private _mapping: any;

  public get class() {
    return this._class;
  }

  public get childClass(): string {
    return this._childClass;
  }

  public get image() {
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
    return this._fields;
  }

  public get mapping(): any {
    return this._mapping;
  }

  public get hasImage(): boolean {
    return this._image === AttributeImage.Enabled;
  }

  public get hasNestedImage(): boolean {
    return this._image === AttributeImage.Parent;
  }

  constructor(data: any = {}, mapping: any = {}) {
    this._initConfig(data, mapping);
  }

  private _initConfig(data, mapping) {
    this._class = data.class;
    this._childClass = data.childClass;
    this._image = data.image;
    this._backgroundColor = data.backgroundColor;
    this._color = data.color;
    this._name = data.name;
    this._pluralName = data.pluralName;
    this._order = data.order;
    this._selectedOrder = data.selectedOrder;
    this._fields = Array.isArray(data.fields) ? data.fields.slice() : data.fields;
    this._mapping = mapping;

    this.hasEditableImage = this._image === AttributeImage.Enabled;
  }
}
