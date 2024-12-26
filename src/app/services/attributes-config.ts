import { inject, Inject, Injectable } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';
import { FlatItemNode } from '@firestitch/tree';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sortBy } from 'lodash-es';

import { AttributeOrder } from '../enums/enums';
import { AttributeConfig, FsAttributeConfig } from '../interfaces/attribute-config.interface';
import { AttributeItem } from '../models/attribute';
import { AttributeConfigItem } from '../models/attribute-config';
import { FS_ATTRIBUTE_CONFIG } from '../providers';


@Injectable()
export class AttributesConfig {

  private readonly _configs = new Map<string, AttributeConfigItem>();
  private readonly _prompt = inject(FsPrompt);

  constructor(
    @Inject(FS_ATTRIBUTE_CONFIG) private _fsAttributeConfig: FsAttributeConfig,
  ) {
    this._initConfigs(_fsAttributeConfig.configs, _fsAttributeConfig.mapping);
  }

  public getAttributes(
    e: any, 
    attributeConfig: AttributeConfigItem,

  ): Observable<{ data: AttributeItem[], paging: any }> {
    return this._fsAttributeConfig
      .getAttributes(e)
      .pipe(
        map((response) => {
          const data = response.data.map((attribute) => {
            return new AttributeItem(attribute, attributeConfig);
          });

          return { data: data, paging: response.paging };
        }),
      );
  }

  public getAttributeConfig(klass) {
    const attributeConfig = this._fsAttributeConfig.configs.find((eachConfig) => {
      return eachConfig.class === klass;
    });

    return attributeConfig;
  }

  public sortAttributes(klass, attributes) {
    const attrConfig = this.getAttributeConfig(klass);
    if (attrConfig && attrConfig.order === AttributeOrder.Alphabetical) {
      return sortBy(attributes, (o) => {
        return o.name; 
      });
    }
 
    return attributes;
  }

  public deleteAttribute(event: AttributeItem) {
    return this._fsAttributeConfig.deleteAttribute(event);
  }

  public deleteConfirmation(attributeItem: AttributeItem) {
    return this._prompt.confirm({
      title: 'Confirm',
      template: `Are you sure you want to delete this ${attributeItem.config.name.toLowerCase()}?`,
    });
  }

  public saveAttribute(event: { 
    attribute: AttributeItem,
    class?: string,
    data?: any,
    parent?: any,
   }) {
    event.attribute = event && event.attribute
      ? event.attribute.toJSON()
      : null;

    return this._fsAttributeConfig.saveAttribute(event);
  }

  public getAttributeTree(event: any) {
    return this._fsAttributeConfig.getAttributeTree(event)
      .pipe(
        map((response) => {
          const data = response.attributes.map((attribute) => {
            return new AttributeItem(attribute, this.getConfig(attribute.class)).getData();
          });

          return { data: data };
        }),
      );
  }

  public getSelectedAttributes(e: any) {
    return this._fsAttributeConfig.getSelectedAttributes(e)
      .pipe(
        map((response) => {
          const data = response.data.map((attribute) => {
            return new AttributeItem(attribute, this.getConfig(attribute.class));
          });

          return { data: data, paging: response.paging };
        }),
      );
  }

  public compare(o1: any, o2: any) {
    return this._fsAttributeConfig.compareAttributes(o1, o2);
  }

  public compareAttributes(o1: AttributeItem, o2: AttributeItem) {
    return this._fsAttributeConfig.compareAttributes(o1 && o1.toJSON(), o2 && o2.toJSON());
  }

  public attributeSelectionChanged(event: any) {
    if (event && event.attribute) {
      event.attribute = event.attribute.toJSON();
    }

    if (event && event.value) {
      event.value = event.value.toJSON();
    }

    if (event.attributes && Array.isArray(event.attributes)) {
      event.attributes = event.attributes.map((attr) => attr.toJSON());
    }

    if (event.reorder) {
      event.reorder.item = event.reorder.item.toJSON();

      if (event.reorder.items && Array.isArray(event.reorder.items)) {
        event.reorder.items = event.reorder.items.map((item) => item.data.toJSON());
      }
    }

    return this._fsAttributeConfig.attributeSelectionChanged(event);
  }

  public reorderAttributes(event: any) {
    if (event && Array.isArray(event.attributes)) {
      event.attributes = event.attributes.map((attr) => attr.data.toJSON());
    }

    return this._fsAttributeConfig.reorderAttributes(event);
  }

  public saveAttributeImage(event: any) {
    event.attribute = event && event.attribute
      ? event.attribute.toJSON()
      : null;

    return this._fsAttributeConfig.saveAttributeImage(event);
  }

  public canDropAttribute(
    node?: FlatItemNode,
    fromParent?: FlatItemNode,
    toParent?: FlatItemNode,
    dropPosition?: any,
    prevElement?: FlatItemNode,
    nextElement?: FlatItemNode,
  ) {
    return this._fsAttributeConfig
      .canDropTreeAttribute(
        node,
        fromParent,
        toParent,
        dropPosition,
        prevElement,
        nextElement,
      );
  }

  public reorderAttributeTree(event: any) {
    if (event.attribute) {
      event.attribute = event.attribute.toJSON();
    }

    return this._fsAttributeConfig.reorderAttributeTree(event);
  }

  public sortByAttributeTree(data) {
    return this._fsAttributeConfig.sortByAttributeTree(data);
  }

  public getConfig(name: string): AttributeConfigItem {
    if (this._configs.has(name)) {
      return this._configs.get(name);
    } 
    throw new Error(`Configuration with class "${name}" can not be found. Please check your configs.`);
  }

  private _initConfigs(configs: AttributeConfig[] = [], mappings) {
    configs.forEach((config) => {
      const configItem = new AttributeConfigItem(config, mappings);

      this._configs.set(configItem.class, configItem);
    });

    this._configs.forEach((configItem) => {
      if (configItem.childClass) {
        const child = this.getConfig(configItem.childClass);

        configItem.child = child;
        child.parent = configItem;
      }
    });
  }
}
