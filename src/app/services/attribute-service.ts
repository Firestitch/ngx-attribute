import { inject, Injectable } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';
import { FlatItemNode } from '@firestitch/tree';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { sortBy } from 'lodash-es';

import { AttributeOrder } from '../enums/enums';
import { AttributeConfig, AttributeConfigFetchAttributesData, AttributeMappingConfig, FsAttributeConfig } from '../interfaces';
import { AttributeItem } from '../models/attribute';
import { AttributeConfigItem } from '../models/attribute-config';
import { FS_ATTRIBUTE_CONFIG } from '../providers';


@Injectable()
export class AttributeService {

  private readonly _configs = new Map<string, AttributeConfigItem>();
  private readonly _prompt = inject(FsPrompt);
  private _config: FsAttributeConfig;

  constructor() {
    this.init(inject(FS_ATTRIBUTE_CONFIG, { optional: true }));
  }

  public init(config: FsAttributeConfig) {
    this._config = {
      ...config,
      attribute: {   
        compare: config.compareAttributes,
        save: config.saveAttribute,
        delete: config.deleteAttribute,
        ...config.attribute,
      },
      attributeTree: {
        fetch: config.getAttributeTree,
        reorder: config.reorderAttributeTree,
        sort: config.sortByAttributeTree,
        canDrop: config.canDropTreeAttribute,
        ...config.attributeTree,
      },
      attributes: {
        reorder: config.reorderAttributes,
        fetch: config.getAttributes,
        ...config.attributes,
      },
      selectedAttributes: {
        changed: config.attributeSelectionChanged,
        fetch: config.getSelectedAttributes,
        ...config.selectedAttributes,
      },
      attributeImage: {
        save: config.saveAttributeImage,
        ...config.attributeImage,
      },
    };


    this._initConfigs(this._config.configs, this._config.mapping);

    return this;
  }

  public getAttributes(
    _data: AttributeConfigFetchAttributesData,
    attributeConfig: AttributeConfigItem,
  ): Observable<{ data: AttributeItem[], paging: any }> {
    return this._config
      .attributes.fetch(_data)
      .pipe(
        map((response) => {
          const data = response.data.map((attribute) => {
            return new AttributeItem(attribute, attributeConfig);
          });

          return { data, paging: response.paging };
        }),
      );
  }

  public getAttributeConfig(klass) {
    const attributeConfig = this._config
      .configs.find((eachConfig) => {
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
    return this._config.attribute.delete(event);
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

    return this._config.attribute.save(event);
  }

  public getAttributeTree(event: any) {
    return this._config.attributeTree.fetch(event)
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
    return this._config.selectedAttributes.fetch(e)
      .pipe(
        map((response) => {
          const data = response.data.map((attribute) => {
            return new AttributeItem(attribute, this.getConfig(attribute.class));
          });

          return { data: data, paging: response.paging };
        }),
      );
  }

  public compare(o1: AttributeItem, o2: AttributeItem) {
    const compare = this._config.attribute.compare || 
      ((a1: AttributeItem, a2: AttributeItem) =>  a1?.id === a2?.id);

    return compare(o1, o2);
  }

  public compareAttributes(o1: AttributeItem, o2: AttributeItem) {
    if (o1 && !(o1 instanceof AttributeItem)) {
      o1 = new AttributeItem(o1, this.getConfig((<any>o1).class));
    }

    if (o2 && !(o2 instanceof AttributeItem)) {
      o2 = new AttributeItem(o2, this.getConfig((<any>o2).class));
    }

    return this.compare(o1 && o1.toJSON(), o2 && o2.toJSON());
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

    return this._config.selectedAttributes.changed(event);
  }

  public reorderAttributes(event: any) {
    if (event && Array.isArray(event.attributes)) {
      event.attributes = event.attributes.map((attr) => attr.data.toJSON());
    }

    return this._config.attributes.reorder(event);
  }

  public saveAttributeImage(event: any) {
    event.attribute = event && event.attribute
      ? event.attribute.toJSON()
      : null;

    return this._config.attributeImage.save(event);
  }

  public canDropAttribute(
    node?: FlatItemNode,
    fromParent?: FlatItemNode,
    toParent?: FlatItemNode,
    dropPosition?: any,
    prevElement?: FlatItemNode,
    nextElement?: FlatItemNode,
  ) {
    return this._config
      .attributeTree
      .canDrop(
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

    return this._config.attributeTree.reorder(event);
  }

  public sortByAttributeTree(data) {
    return this._config.attributeTree.sort(data);
  }

  public getConfig(name: string): AttributeConfigItem {
    if (this._configs.has(name)) {
      return this._configs.get(name);
    }
    
    throw new Error(`Configuration with class "${name}" can not be found. Please check your configs.`);
  }

  private _initConfigs(configs: AttributeConfig[] = [], mappings: AttributeMappingConfig) {
    configs.forEach((config) => {
      config = {
        ...config,
        mapping: {
          ...mappings,
          ...(config.mapping || {}),
        },
      };

      const configItem = new AttributeConfigItem(config);

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
