import { Component, Input, Output, EventEmitter, Inject, OnInit, OnChanges, HostBinding } from '@angular/core';
import { filter } from 'lodash-es';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { getAttributeValue } from '../../helpers/helpers';


@Component({
  selector: 'fs-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: [ './attribute.component.scss' ],
})
export class FsAttributeComponent implements OnInit, OnChanges {

  @HostBinding('class') hostClass = '';


  @Input() config: any = { background: true, color: true, image: true};
  @Input() removable: any;
  @Input() selectable: any;
  @Input() selected: any;
  @Input() attribute: any = {};
  @Input() class = '';
  @Output() selectedToggled = new EventEmitter();

  public backgroundColor;
  public color;
  public image;

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig) {}

  private init() {

    if (!this.config || !this.attribute) {
      return;
    }

    if (!this.selectable && this.config.backgroundColor) {
      this.backgroundColor = this.getAttributeValue('backgroundColor');
    } else {
      this.backgroundColor = '';
    }

    if ((this.selected || !this.selectable) && this.config.color) {
      this.color = this.getAttributeValue('color');
    }

    this.image = this.config.image ? this.getAttributeValue('image') : '';
  }

  private getAttributeValue(name) {
    const mapping = this.fsAttributeConfig.mapping[name];
    return getAttributeValue(this.attribute, mapping);
  }

  ngOnChanges() {
    this.init();
  }

  ngOnInit() {

    const config = filter(this.fsAttributeConfig.configs, { class: this.class })[0];

    this.hostClass = 'fs-attribute fs-attribute-' + this.class;

    if (config) {
      this.config = config
    }

    this.init();
  }
}

