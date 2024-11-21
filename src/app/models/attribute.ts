import { clone } from 'lodash-es';

import { AttributeColor, AttributeImage } from '../enums/enums';
import { getAttributeValue, setAttributeValue } from '../helpers/helpers';

import { AttributeConfigItem } from './attribute-config';


export class AttributeItem {

  public id = null;
  public class = null;
  public name = null;
  public state = null;

  private _children: AttributeItem[] = [];
  private _config: AttributeConfigItem;
  private _image = null;
  private _backgroundColor = null;
  private _color = null;
  private _parent: AttributeItem;
  private _attribute = {};

  public get config() {
    return this._config;
  }

  public get image() {
    return this._image;
  }

  public set image(value) {
    this.setImage(value);
  }

  public get backgroundColor() {
    return this._backgroundColor;
  }

  public set backgroundColor(value) {
    this.setBackgroundColor(value);
  }

  public get color() {
    return this._color;
  }

  public set color(value) {
    this.setColor(value);
  }

  public get children() {
    return this._children.slice();
  }

  public get parent() {
    return this._parent;
  }

  constructor(
    data: any = {},
    config: AttributeConfigItem,
    parent: AttributeItem = null,
  ) {
    this._parent = parent;
    this._config = config;
    this._initParent(data);
    this._initAttribute(data);
    this._initChildren(data);
  }

  public setImage(value) {
    this._image = this._config.image === AttributeImage.Parent && this.parent ? this.parent.image : value;
  }

  public setBackgroundColor(value) {
    this._backgroundColor = this._config.backgroundColor === AttributeColor.Parent && this.parent ? this.parent.backgroundColor : value;
  }

  public setColor(value) {
    this._color = this._config.color === AttributeColor.Parent && this.parent ? this.parent.color : value;
  }

  /**
   * Prepare attirubte for save on the server
   */
  public toJSON(): any {
    const mapping = this._config.mapping;
    const attribute = clone(this._attribute);

    setAttributeValue(attribute, mapping.id, this.id);
    setAttributeValue(attribute, mapping.name, this.name);
    setAttributeValue(attribute, mapping.image, this.image);
    setAttributeValue(attribute, mapping.backgroundColor, this.backgroundColor);
    setAttributeValue(attribute, mapping.color, this.color);
    setAttributeValue(attribute, mapping.state, this.state);

    if (mapping.childAttributes && this._children && Array.isArray(this._children)) {
      const children = this._children.reduce((acc, child) => {

        acc.push(child.toJSON());

        return acc;
      }, []);

      setAttributeValue(attribute, mapping.childAttributes, children);
    }

    return attribute;
  }

  /**
   * Data for using in attributes
   *
   * Unlike toJSON() this method will return an object based on mapping
   */
  public getData(): any {
    const mapping = this._config.mapping;
    const attribute = {
      class: this.class,
      id: this.id,
      name: this.name,
      image: this.image,
      state: this.state,
      backgroundColor: this.backgroundColor,
      color: this.color,
      original: this,
    };

    if (mapping.childAttributes && this._children && Array.isArray(this._children)) {
      const children = this._children.reduce((acc, child) => {

        acc.push(child.getData());

        return acc;
      }, []);

      setAttributeValue(attribute, mapping.childAttributes, children);
    }

    return attribute;
  }

  private _initAttribute(data) {
    const mapping = this._config.mapping;
    this._attribute = clone(data);
    this.class = data.class;
      
    this.id = getAttributeValue(data, mapping.id);
    this.name = getAttributeValue(data, mapping.name);

    if (this._config.image !== AttributeImage.Disabled) {
      this.setImage(getAttributeValue(data, mapping.image));
    }

    this.setBackgroundColor(getAttributeValue(data, mapping.backgroundColor));
    this.setColor(getAttributeValue(data, mapping.color));
  }

  private _initParent(data) {
    if (this._config.parent && !this._parent) {
      if (this._config.mapping.parentAttribute) {
        const parent = getAttributeValue(data, this._config.mapping.parentAttribute);

        if (parent) {
          this._parent = new AttributeItem(parent, this._config.parent);
        }
      }
    }
  }

  private _initChildren(data) {
    if (this._config.child) {
      const children = getAttributeValue(data, this._config.mapping.childAttributes);

      if (children && Array.isArray(children)) {
        this._children = children
          .map((child) => new AttributeItem(child, this._config.child, this));
      }
    }
  }
}
