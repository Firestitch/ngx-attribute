import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';


import { AttributeItem } from '../../models/attribute';
import { AttributesConfig } from '../../services/attributes-config';


@Component({
  selector: 'fs-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
})
export class FsAttributeComponent implements OnInit {

  @HostBinding('class') hostClass = '';

  @Input()
  public config: any = { background: true, color: true, image: true };

  @Input()
  public removable: any;

  @Input()
  public selectable: any;

  @Input()
  public size: 'small' | 'tiny';

  @Input()
  public selected: any;

  @Input()
  set attribute(value) {
    this._attribute = value instanceof AttributeItem ? value : new AttributeItem(value, this._attributesConfig);
  }

  @Input('class')
  public class = '';

  @Output()
  public selectedToggled = new EventEmitter();

  private _attribute: AttributeItem;

  constructor(private _attributesConfig: AttributesConfig) {}

  get attribute() {
    return this._attribute;
  }

  public ngOnInit() {
    const config = this._attributesConfig.getConfig(this.class);

    this.hostClass = `fs-attribute fs-attribute-${  this.class}`;

    if (config) {
      this.config = config;
    }
  }
}

