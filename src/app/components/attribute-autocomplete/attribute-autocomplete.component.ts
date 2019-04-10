import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsAttributeAutocompleteComponent),
    multi: true
  }]
})
export class FsAttributeAutocompleteComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  public data;

  @Input('class')
  public klass;

  @Input()
  public label = 'Select...';

  @Input()
  public required = false;

  @Input()
  public draggable = true;

  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _value;
  private _destroy$ = new Subject();

  constructor(public attributesConfig: AttributesConfig) {}

  set value(value) {
    if (value !== void 0 && value !== this._value) {
      this._value = value;
      this.onChange(this._value);
      this.onTouch(this._value);
    }
  }

  get value() {
    return this._value;
  }

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.configs.get(this.klass);

    if (!this.label) {
      this.label = this.attributeConfig.name;
    }
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

  public writeValue(value) {
    this.value = value;
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }
}
