import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';


@Component({
  selector: 'fs-attribute-select',
  templateUrl: './attribute-select.component.html',
  styleUrls: [ './attribute-select.component.scss' ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsAttributeSelectComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  public data;

  @Input()
  set class(value) {
    this.klass = value;
    this.attributeConfig = this.attributesConfig.getConfig(value);

    if (this.attributeConfig) {
      this.attributeName = this.attributeConfig.name;

      this.fetch();
    }
  }

  @Input()
  public label;

  @Input()
  public required = false;

  @Input()
  public disabled = false;

  @Input()
  public noneOption = false;

  public klass;
  public attributeName;
  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _value;
  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private _cdRef: ChangeDetectorRef,
  ) {}

  set value(value) {
    if (value !== this._value) {
      this._value = value;

      const data = this._getRawValue();
      this.onChange(data);
      this.onTouch(data);
    }
  }

  get value() {
    return this._value;
  }

  public ngOnInit() {

  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public writeValue(value) {
    if (value !== this.value) {
      this._value = value
        ? new AttributeItem(value, this.attributesConfig)
        : value;

      this._cdRef.markForCheck();
    }
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

        this._cdRef.markForCheck();
      });
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  public compare = (o1: any, o2: any) => {
    return this.attributesConfig.compareAttributes(o1, o2);
  };

  private _getRawValue() {
    return (this.value instanceof AttributeItem)
      ? this.value.toJSON()
      : this.value
  }
}
