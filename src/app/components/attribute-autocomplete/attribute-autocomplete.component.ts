import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { filter } from 'lodash-es';

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

      this.save();
    }
  }

  get value() {
    return this._value;
  }

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    if (!this.label) {
      this.label = this.attributeConfig.name;
    }
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public fetch = (keyword) => {
    return this.attributesConfig.getAttributes({
      class: this.klass,
      data: this.data,
      keyword: keyword,
    })
      .pipe(
        map((response) => {
          return response.data;
        }),
        takeUntil(this._destroy$)
      );
  };

  public save() {
    this.attributesConfig.attributeSelectionChanged({
      class: this.klass,
      data: this.data,
      attributes: this.value,
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe()
  }

  public writeValue(value) {
    this.value = value;
  }

  public compare = (o1: any, o2: any) => {
    return this.attributesConfig.compareAttributes(o1, o2);
  };

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }
}
