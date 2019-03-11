import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';
import { wrapAttributes } from '../../helpers/helpers';


@Component({
  selector: 'fs-attribute-select',
  templateUrl: 'attribute-select.component.html',
  styleUrls: [ 'attribute-select.component.scss' ],
})
export class FsAttributeSelectComponent implements OnInit, OnDestroy {

  public attributes: any = [];
  public attributeConfig: any = {};
  public label = '';
  private $destroy = new Subject();

  @Input() data;
  @Input('class') class;
  @Output() changed = new EventEmitter();

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {}

  ngOnInit() {

    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.class })[0] || {};
    this.label = this.attributeConfig.name;

    const e = {
      data: this.data,
      class: this.class
    };

    this.fsAttributeConfig.getAttributes(e)
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe((response) => {
      this.attributes =  wrapAttributes(this.fsAttributeConfig, response.data);
    });
  }

  selectionChange(e) {
    this.changed.emit(e.value.attribute);
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
