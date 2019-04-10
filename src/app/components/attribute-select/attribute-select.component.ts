import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { AttributesConfig } from '../../services/attributes-config';


@Component({
  selector: 'fs-attribute-select',
  templateUrl: './attribute-select.component.html',
  styleUrls: [ './attribute-select.component.scss' ],
})
export class FsAttributeSelectComponent implements OnInit, OnDestroy {

  public attributes: any = [];
  public attributeConfig: any = {};
  public label = '';
  private $destroy = new Subject();

  @Input() data;
  @Input('class') klass;
  @Output() changed = new EventEmitter();

  constructor(public attributesConfig: AttributesConfig) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.configs.get(this.klass);
    this.label = this.attributeConfig.name;

    this.fetch();
  }

  public ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  public selectionChange(e) {
    this.changed.emit(e.value);
  }

  public fetch() {
    const e = {
      data: this.data,
      class: this.klass
    };

    this.attributesConfig.getAttributes(e)
      .pipe(
        takeUntil(this.$destroy)
      )
      .subscribe((response) => {
        this.attributes =  response.data;
      });
  }
}
