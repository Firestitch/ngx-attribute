import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter, map } from 'lodash-es';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { wrapAttributes } from '../../helpers/helpers';

(window as any).global = window;


@Component({
  selector: 'fs-attribute-autocomplete',
  templateUrl: './attribute-autocomplete.component.html',
  styleUrls: ['./attribute-autocomplete.component.scss'],
})
export class FsAttributeAutocompleteComponent implements OnInit, OnDestroy {

  public attributes: any = [];
  public attributeConfig: any = {};
  public label = '';
  public model;

  private destroy$ = new Subject();

  public fetch = (keyword) => {
    return new Observable(observer => {
      this.fsAttributeConfig.getAttributes({ keyword: keyword })
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe((response) => {
          observer.next(wrapAttributes(this.fsAttributeConfig, response.data));
          observer.complete();
        });
    });
  };

  private  = new Subject();

  @Input() data;
  @Input('class') class;
  @Output() changed = new EventEmitter();

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {
  }

  ngOnInit() {

    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.class })[0] || {};
    this.label = this.attributeConfig.name;

    const e = {
      data: this.data,
      class: this.class
    };
  }

  change(model) {
    const attributes = map(model, 'attribute');
    this.changed.emit(attributes);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
