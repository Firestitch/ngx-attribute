import { Component, Input, Output, EventEmitter, OnInit, HostBinding } from '@angular/core';
import { filter } from 'lodash-es';
import { AttributeItem } from '../../models/attribute';
import { AttributesConfig } from '../../services/attributes-config';


@Component({
  selector: 'fs-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: [ './attribute.component.scss' ],
})
export class FsAttributeComponent implements OnInit {

  @HostBinding('class') hostClass = '';

  @Input() config: any = { background: true, color: true, image: true};
  @Input() removable: any;
  @Input() selectable: any;
  @Input() selected: any;
  @Input() set attribute(value) {
    if (value instanceof AttributeItem) {
      this._attribute = value;
    } else {
      this._attribute = new AttributeItem(value, this._attributesConfig);
    }
  }

  @Input('class') klass = '';
  @Output() selectedToggled = new EventEmitter();

  private _attribute: AttributeItem;

  constructor(private _attributesConfig: AttributesConfig) {}

  get attribute() {
    return this._attribute;
  }

  public ngOnInit() {
    const config = this._attributesConfig.configs.get(this.klass);

    this.hostClass = 'fs-attribute fs-attribute-' + this.klass;

    if (config) {
      this.config = config
    }
  }
}

