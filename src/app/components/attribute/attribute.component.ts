import { Component, Input, Output, EventEmitter, Inject, OnInit, OnChanges } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { filter, merge } from 'lodash-es';


@Component({
  selector: 'fs-attribute',
  templateUrl: 'attribute.component.html',
  styleUrls: [ 'attribute.component.scss' ],
})
export class FsAttributeComponent implements OnInit, OnChanges {

  @Input() config: any = { background: true, textColor: true, image: true};
  @Input() removable: any;
  @Input() selectable: any;
  @Input() selected: any;
  @Input() attribute: any = {};
  @Input() class: string;
  @Output() selectionChanged = new EventEmitter();

  public backgroundColor;
  public textColor;
  public image;

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig) {}

  private init() {

    if (!this.config || !this.attribute) {
      return;
    }

    if ((this.selected || !this.selectable) && this.config.backgroundColor) {
      this.backgroundColor = this.attribute.backgroundColor;
    } else {
      this.backgroundColor = '';
    }

    if ((this.selected || !this.selectable) && this.config.textColor) {
      this.textColor = this.attribute.textColor;
    }

    this.image = this.config.image ? this.attribute.image : '';
  }

  ngOnChanges() {
    this.init();
  }

  ngOnInit() {

    const attributeConfig = filter(this.attributeConfig.configs, { class: this.class })[0];

    if (attributeConfig) {
      this.config = attributeConfig
    }

    this.init();
  }
}
