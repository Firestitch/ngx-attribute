import {  Component, Input, OnInit, Inject, OnChanges,
          SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { filter, merge } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-attribute-chip',
  templateUrl: 'attribute-chip.component.html',
  styleUrls: [ 'attribute-chip.component.scss' ]
})
export class FsAttributeChipComponent implements OnInit, OnChanges, OnDestroy {

  @Output() clicked = new EventEmitter();
  @Output() selectionChanged = new EventEmitter();
  @Input() attribute: any;
  @Input() selectable: Boolean = false;
  @Input() selected: Boolean = false;
  @Input() removable: Boolean = false;
  @Input('class') set class(value) {
    this._class = value;
  }

  @Input('config') set _config(value) {
    if (value) {
      this.config = value;
    }
  }

  public $destroy = new Subject();
  public config: any = {};
  public _class;
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
    } else {
      this.textColor = '';
    }

    this.image = this.config.image ? this.attribute.image : '';
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  ngOnInit() {

    if (this.selectable) {
      this.clicked
      .pipe(takeUntil(this.$destroy))
      .subscribe(attribute => {
        this.selected = !this.selected;
        this.selectionChanged.emit({ attribute: attribute, selected: this.selected });
        this.init();
      });
    }

    const attributeConfig = filter(this.attributeConfig.configs, { class: this._class })[0];

    let config = {
      backgroundColor: true,
      textColor: true,
      image: true
    };

    if (attributeConfig) {
      config = attributeConfig
    }

    this.config = merge(config, this.config);

    this.init();
  }
}
