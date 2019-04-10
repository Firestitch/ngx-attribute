import { Inject, Injectable } from '@angular/core';
import { AttributeConfigItem } from '../models/attribute-config';
import { FS_ATTRIBUTE_CONFIG } from '../providers';
import { AttributeConfig, FsAttributeConfig } from '../interfaces/attribute-config.interface';
import { map } from 'rxjs/operators';
import { AttributeItem } from '../models/attribute';
import { FlatItemNode } from '@firestitch/tree';


@Injectable()
export class AttributesConfig {
  public readonly configs = new Map<string, AttributeConfigItem>();

  constructor(
    @Inject(FS_ATTRIBUTE_CONFIG) private _fsAttributeConfig: FsAttributeConfig,
  ) {
    this._initConfigs(_fsAttributeConfig.configs, _fsAttributeConfig.mapping);
  }

  public getAttributes(e: any) {
    return this._fsAttributeConfig.getAttributes(e)
      .pipe(
        map((response) => {
          const data = response.data.map((attribute) => {
            return new AttributeItem(attribute, this);
          });

          return { data: data, paging: response.paging}
        })
      )
  }

  public deleteAttribute(event: any) {
    return this._fsAttributeConfig.deleteAttribute(event);
  }

  public saveAttribute(event: any) {
    return this._fsAttributeConfig.saveAttribute(event);
  }

  public getAttributeTree(event: any) {
    return this._fsAttributeConfig.getAttributeTree(event)
      .pipe(
        map((response) => {
          const data = response.attributes.map((attribute) => {
            return new AttributeItem(attribute, this).getData();
          });

          return { data: data }
        })
      );
  }

  public getSelectedAttributes(e: any) {
    return this._fsAttributeConfig.getSelectedAttributes(e)
      .pipe(
        map((response) => {
          const data = response.data.map((attribute) => {
            return new AttributeItem(attribute, this);
          });

          return { data: data, paging: response.paging}
        })
      )
  }

  public compareAttributes(o1: any, o2: any) {
    return this._fsAttributeConfig.compareAttributes(o1, o2);
  }

  public attributeSelectionChanged(event: any) {
    return this._fsAttributeConfig.attributeSelectionChanged(event);
  }

  public reorderAttributes(event: any) {
    return this._fsAttributeConfig.reorderAttributes(event);
  }

  public saveAttributeImage(event: any) {
    return this._fsAttributeConfig.saveAttributeImage(event);
  }

  public reorderAttributeTree(
    node?: FlatItemNode,
    fromParent?: FlatItemNode,
    toParent?: FlatItemNode,
    dropPosition?: any,
    prevElement?: FlatItemNode,
    nextElement?: FlatItemNode
  ) {
    return this._fsAttributeConfig.reorderAttributeTree(
      node,
      fromParent,
      toParent,
      dropPosition,
      prevElement,
      nextElement
    );
  }

  public sortByAttributeTree(data) {
    return this._fsAttributeConfig.sortByAttributeTree(data);
  }

  private _initConfigs(configs: AttributeConfig[] = [], mappings) {
    configs.forEach((config) => {
      const configItem = new AttributeConfigItem(config, mappings);

      this.configs.set(configItem.klass, configItem);
    });

    this.configs.forEach((configItem) => {
      if (!!configItem.childClass) {
        const child = this.configs.get(configItem.childClass);

        configItem.child = child;
        child.parent = configItem;
      }
    })
  };
}
