import { clone } from 'lodash-es';

import { AttributeConfigItem } from './attribute-config';
import { getAttributeValue, setAttributeValue } from '../helpers/helpers';
import { AttributesConfig } from '../services/attributes-config';
import { AttributeColor, AttributeImage } from '../enums/enums';


export class AttributeItem {
  public id = null;
  public klass = null;
  public name = null;
  public configs = null;

  private _children: AttributeItem[] = [];
  private _config: AttributeConfigItem;

  private _image = null;
  private _backgroundColor = null;
  private _color = null;

  private _attributesConfig: AttributesConfig;
  private _parent: AttributeItem;
  private _attribute = {};

  get attributesConfig() {
    return this._attributesConfig;
  }

  get config() {
    return this._config;
  }

  get image() {
    return this._image;
  }

  set image(value) {
    this.setImage(value);
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  set backgroundColor(value) {
    this.setBackgroundColor(value);
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this.setColor(value);
  }

  get children() {
    return this._children.slice();
  }

  get parent() {
    return this._parent;
  }

  constructor(
    data: any = {},
    attributesConfig: AttributesConfig,
    parent: AttributeItem = null
  ) {
    this._attributesConfig = attributesConfig;
    this._parent = parent;

    this._config = this._attributesConfig.configs.get(data.class);
    this._initAttribute(data);
    this._initChildren(data);
  }

  public setImage(value) {
    if (this._config.image === AttributeImage.Parent && this.parent) {
      this._image = this.parent.image;
    } else {
      this._image = value;
    }
  }

  public setBackgroundColor(value) {
    if (this._config.backgroundColor === AttributeColor.Parent && this.parent) {
      this._backgroundColor = this.parent.backgroundColor;
    } else {
      this._backgroundColor = value;
    }
  }

  public setColor(value) {
    if (this._config.color === AttributeColor.Parent && this.parent) {
      this._color = this.parent.color;
    } else {
      this._color = value;
    }
  }

  /**
   * Prepare attirubte for save on the server
   */
  public toJSON() {
    const mapping = this._config.mapping;

    setAttributeValue(this._attribute, mapping.id, this.id);
    setAttributeValue(this._attribute, mapping.name, this.name);
    setAttributeValue(this._attribute, mapping.image, this.image);
    setAttributeValue(this._attribute, mapping.backgroundColor, this.backgroundColor);
    setAttributeValue(this._attribute, mapping.color, this.color);
    setAttributeValue(this._attribute, mapping.configs, this.configs);

    if (mapping.childAttributes && this._children && Array.isArray(this._children)) {
      const children = this._children.reduce((acc, child) => {

        acc.push(child.toJSON());

        return acc;
      }, []);

      setAttributeValue(this._attribute, mapping.childAttributes, children);
    }

    return this._attribute;
  }

  /**
   * Data for using in attributes
   *
   * Unlike toJSON() this method will return an object based on mapping
   */
  public getData(): any {
    const mapping = this._config.mapping;
    const attribute = {
      class: this.klass,
      id: this.id,
      name: this.name,
      image: this.image,
      backgroundColor: this.backgroundColor,
      color: this.color,
      configs: this.configs,
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

    this.klass = data.class;
    this.id = getAttributeValue(data, mapping.id);
    this.name = getAttributeValue(data, mapping.name);
    this.configs = getAttributeValue(data, mapping.configs);

    this.setImage(getAttributeValue(data, mapping.image));
    this.setBackgroundColor(getAttributeValue(data, mapping.backgroundColor));
    this.setColor(getAttributeValue(data, mapping.color));
  }

  private _initChildren(data) {
    const children = getAttributeValue(data, this._config.mapping.childAttributes);

    if (children && Array.isArray(children)) {
      this._children = children.map((child) => new AttributeItem(child, this._attributesConfig, this));
    }
  }
}
