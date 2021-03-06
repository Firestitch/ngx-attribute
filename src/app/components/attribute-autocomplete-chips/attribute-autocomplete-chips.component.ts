import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectorRef, ContentChildren, TemplateRef, QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { FsAttributeAutocompleteChipsStaticDirective } from './../../directives/attribute-autocomplete-chips-static.component';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';

@Component({
  selector: 'fs-attribute-autocomplete-chips',
  templateUrl: './attribute-autocomplete-chips.component.html',
  styleUrls: ['./attribute-autocomplete-chips.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsAttributeAutocompleteChipsComponent),
    multi: true
  }]
})
export class FsAttributeAutocompleteChipsComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ContentChildren(FsAttributeAutocompleteChipsStaticDirective, { read: TemplateRef })
  public staticTemplates: TemplateRef<any>[] = null;

  @ContentChildren(FsAttributeAutocompleteChipsStaticDirective)
  public staticDirectives: QueryList<FsAttributeAutocompleteChipsStaticDirective>;

  @Input() public color = '';
  @Input() public background = '';

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

  @Input()
  public queryConfigs: any;

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
      query_configs: this.queryConfigs,
    })
      .pipe(
        map((response) => {
          return response.data;
        }),
        takeUntil(this._destroy$)
      );
  };

  public save(item = null, selected = false, reorder = null) {
    this.attributesConfig.attributeSelectionChanged({
      class: this.klass,
      data: this.data,
      attributes: this.value,
      selected: selected,
      reorder: reorder,
      value: item,
      query_configs: this.queryConfigs,
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe()
  }

  public writeValue(value) {
    if (value && Array.isArray(value)) {
      this._value = value.map((item) => new AttributeItem(item, this.attributesConfig));
    } else {
      this._value = null;
    }

    this._cdRef.markForCheck();
  }

  public selected(item) {
    this.save(item.data, true);
  }

  public removed(item) {
    this.save(item.data, false);
  }

  public reordered(data) {
    this.save(data.item, false, data);
  }

  public compare = (o1: any, o2: any) => {
    return this.attributesConfig.compareAttributes(o1, o2);
  };

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  public staticClick(event, index) {
    const staticDirective: FsAttributeAutocompleteChipsStaticDirective = this.staticDirectives.toArray()[index];
    staticDirective.click.emit(event);
  }

  private _getRawValue() {
    let data = null;

    if (Array.isArray(this.value)) {
      data = this.value.map((item) => {
        return item.toJSON();
      });
    }

    return data;
  }
}
