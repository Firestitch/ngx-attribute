import { AttributeColor, AttributeImage, AttributeOrder } from '../enums/enums';

export class AttributeConfigItem {
  public parent: AttributeConfigItem;
  public child: AttributeConfigItem;

  public hasEditableImage: boolean;

  private _klass;
  private _childClass: string;
  private _image;
  private _backgroundColor: AttributeColor;
  private _color: AttributeColor;
  private _name: string;
  private _pluralName: string;
  private _order: AttributeOrder;
  private _fields: any[];
  private _mapping: any;

  get klass() {
    return this._klass;
  }

  get childClass(): string {
    return this._childClass;
  }

  get image() {
    return this._image;
  }

  get backgroundColor(): AttributeColor {
    return this._backgroundColor;
  }

  get color(): AttributeColor {
    return this._color;
  }

  get name(): string {
    return this._name;
  }

  get pluralName(): string {
    return this._pluralName;
  }

  get order(): AttributeOrder {
    return this._order;
  }

  get fields(): any[] {
    return this._fields;
  }

  get mapping(): any {
    return this._mapping;
  }

  get hasImage(): boolean {
    return this._image === AttributeImage.Enabled;
  }

  get hasNestedImage(): boolean {
    return this._image === AttributeImage.Parent;
  }

  constructor(data: any = {}, mapping: any = {}) {
    this._initConfig(data, mapping);
  }

  private _initConfig(data, mapping) {
    this._klass = data.class;
    this._childClass = data.childClass;
    this._image = data.image;
    this._backgroundColor = data.backgroundColor;
    this._color = data.color;
    this._name = data.name;
    this._pluralName = data.pluralName;
    this._order = data.order;
    this._fields = Array.isArray(data.fields) ? data.fields.slice() : data.fields;
    this._mapping = mapping;

    this.hasEditableImage = this._image === AttributeImage.Enabled;
  }
}
