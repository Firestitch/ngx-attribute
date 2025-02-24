import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

import { AttributeConfig } from '../../interfaces';
import { AttributeConfigItem, AttributeItem } from '../../models';
import { AttributesConfig } from '../../services/attributes-config';


@Component({
  selector: 'fs-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
})
export class FsAttributeComponent implements OnInit {

  @HostBinding('class') public hostClass = '';

  @Input()
  public removable: boolean;

  @Input()
  public selectable: boolean;

  @Input()
  public size: 'small' | 'tiny';

  @Input()
  public selected: boolean;

  @Input()
  public config: AttributeConfig;

  public attributeConfig: AttributeConfigItem;

  @Input() public attribute;

  @Input('class')
  public class = '';

  @Output()
  public selectedToggled = new EventEmitter();

  constructor(
    private _attributesConfig: AttributesConfig,
  ) {}

  public ngOnInit() {    
    this.attributeConfig = this.config ? 
      new AttributeConfigItem(this.config) :
      this._attributesConfig.getConfig(this.class || this.attribute.class);

    if(!(this.attribute instanceof AttributeItem)) {
      this.attribute = new AttributeItem(
        this.attribute,
        this.attributeConfig,
      );
    }

    this.hostClass = `fs-attribute fs-attribute-${this.attributeConfig.class}`;
  }
}

