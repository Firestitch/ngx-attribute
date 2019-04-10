import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';


@Component({
  selector: 'fs-attribute-select',
  templateUrl: './attribute-select.component.html',
  styleUrls: [ './attribute-select.component.scss' ],
})
export class FsAttributeSelectComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input('class')
  public klass;

  @Input()
  public label;

  @Output()
  public changed = new EventEmitter();

  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem;
  private _destroy$ = new Subject();

  constructor(public attributesConfig: AttributesConfig) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.configs.get(this.klass);

    if (!this.label) {
      this.label = this.attributeConfig.name;
    }

    this.fetch();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
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
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.attributes =  response.data;
      });
  }
}
