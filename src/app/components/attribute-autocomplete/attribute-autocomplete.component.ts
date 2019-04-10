import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, map, shareReplay } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { AttributeItem } from '../../models/attribute';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';


@Component({
  selector: 'fs-attribute-autocomplete',
  templateUrl: './attribute-autocomplete.component.html',
  styleUrls: ['./attribute-autocomplete.component.scss'],
})
export class FsAttributeAutocompleteComponent implements OnInit, OnDestroy {

  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem;
  public label = '';
  public model;

  private _destroy$ = new Subject();

  @Input() data;
  @Input('class') klass;
  @Output() changed = new EventEmitter();

  constructor(public attributesConfig: AttributesConfig) {}

  public ngOnInit() {

    this.attributeConfig = this.attributesConfig.configs.get(this.klass);
    this.label = this.attributeConfig.name;
  }

  public change(model) {
    this.changed.emit(model);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public fetch = (keyword) => {
    const attrs$ = this.attributesConfig.getAttributes({
      class: this.klass,
      data: this.data,
      keyword: keyword,
    })
      .pipe(
        map((response) => {
          return response.data;
        }),
        shareReplay(1),
        takeUntil(this._destroy$)
      );

    attrs$.subscribe((response: any) => {
      this.attributes = response.data;
    });

    return attrs$;
  };
}
