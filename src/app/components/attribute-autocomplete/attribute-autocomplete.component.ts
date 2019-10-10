import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil, map} from 'rxjs/operators';

import { isEmpty } from 'lodash-es';

import { FsAutocompleteComponent } from '@firestitch/autocomplete';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';


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

  @ViewChild(FsAutocompleteComponent, { static: true })
  public autocomplete: FsAutocompleteComponent;

  @Input()
  public data;

  @Input()
  set class(value) {
    this.klass = value;
    this.autocomplete.searchData = [];
  }

  @Input()
  public label = 'Select...';

  @Input()
  public required = false;

  public klass;
  public attributeConfig: AttributeConfigItem;
  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _value;
  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
  ) {}

  set value(value) {
    if (this._value !== value) {
      this._value = value;

      const data = this.value ? this.value.toJSON() : null;
      this.onChange(data);
      this.onTouch(data);
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
      )
  };

  public displayWith = (data) => {
    const parent = data.parent ? data.parent.name + ': ' : '';
    return parent + data.name;
  };

  public writeValue(value) {
    if (value !== this.value) {
      this._value = value
        ? new AttributeItem(value, this.attributesConfig)
        : value;
    }
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
