import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AttributeConfig } from '../../interfaces';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { FsAttributeManageComponent } from '../attribute-manage';

import { FsAttributeAutocompleteChipsStaticDirective } from './../../directives';

@Component({
  selector: 'fs-attribute-autocomplete-chips',
  templateUrl: './attribute-autocomplete-chips.component.html',
  styleUrls: ['./attribute-autocomplete-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsAttributeAutocompleteChipsComponent),
    multi: true,
  }],
})
export class FsAttributeAutocompleteChipsComponent 
implements OnInit, OnDestroy, ControlValueAccessor {

  @ContentChildren(FsAttributeAutocompleteChipsStaticDirective, { read: TemplateRef })
  public staticTemplates: TemplateRef<any>[] = null;

  @ContentChildren(FsAttributeAutocompleteChipsStaticDirective)
  public staticDirectives: QueryList<FsAttributeAutocompleteChipsStaticDirective>;

  @Input() 
  public color = '#fff';

  @Input() 
  public background = '';

  @Input() 
  public initOnClick = false;
  
  @Input()
  public showManage = false;
  
  @Input()
  public disabled = false;

  @Input()
  public placeholder;

  @Input()
  public size: 'small' | 'large' = 'large';

  @Input()
  public saveOnChange = true;

  @Input()
  public multiple = true;

  @Input()
  public data;

  @Input('class')
  public class;

  @Input()
  public label;

  @Input()
  public required = false;

  @Input()
  public floatLabel;

  @Input()
  public draggable = false;

  @Input()
  public padless = false;

  @Input()
  public config: AttributeConfig;

  public attributeConfig: AttributeConfigItem;

  public onChange: (value: any) => void;
  public onTouch: (value: any) => void;

  private _value;
  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private _cdRef: ChangeDetectorRef,
    private _dialog: MatDialog,
  ) {}

  public set value(value) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  public get value() {
    return this._value;
  }

  public change(value) {
    const data = this._getRawValue(value);
    this.onChange(data);
    this.onTouch(data);
  }

  public ngOnInit() {
    this.attributeConfig = this.config ? 
      new AttributeConfigItem(this.config) : 
      this.attributesConfig.getConfig(this.class);

    if (!this.label) {
      this.label = this.attributeConfig.name;
    }

    if (!this.background && this.attributeConfig.backgroundColor) {
      this.background = this.attributeConfig.mapping.backgroundColor;
    }

    if (!this.color && this.attributeConfig.color) {
      this.color = this.attributeConfig.mapping.color;
    }

    this.label = this.label || 
      (this.multiple ? this.attributeConfig.pluralName : this.attributeConfig.name);
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public fetch = (keyword) => {
    return this.attributesConfig
      .getAttributes({
        class: this.attributeConfig.class,
        data: this.data,
        keyword: keyword,
      }, this.attributeConfig)
      .pipe(
        map((response) => {
          return response.data;
        }),
        takeUntil(this._destroy$),
      );
  };

  public writeValue(value) {
    if (value) {
      if(this.multiple) {
        this._value = Array.isArray(value) ? 
          value.map((item) => new AttributeItem(item, this.attributeConfig)) : [];
      } else {
        this._value = new AttributeItem(value, this.attributeConfig);
      }
    } else {
      this._value = null;
    }

    this._cdRef.markForCheck();
  }

  public selected(item) {
    if (this.saveOnChange) {
      this.save(item.data, true);
    }
  }

  public removed(item) {
    if (this.saveOnChange) {
      this.save(item.data, false);
    }
  }

  public reordered(data) {
    if (this.saveOnChange) {
      this.save(data.item, false, data);
    }
  }

  public compare = (o1: any, o2: any) => {
    return this.attributesConfig.compareAttributes(o1, o2);
  };

  public registerOnChange(fn) {
    this.onChange = fn;  
  }
  public registerOnTouched(fn) {
    this.onTouch = fn; 
  }

  public manage() {
    this._dialog.open(FsAttributeManageComponent, {
      data: {
        attributeConfig: this.attributeConfig,
        data: this.data,
        size: this.size,
      },
      autoFocus: false,
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.fetch(response?.attribute.id);
      });
  }

  public staticClick(event, index) {
    const staticDirective: FsAttributeAutocompleteChipsStaticDirective = this.staticDirectives
      .toArray()[index];
    staticDirective.click.emit(event);
  }

  public save(item = null, selected = false, reorder = null) {
    this.attributesConfig
      .attributeSelectionChanged({
        class: this.attributeConfig.class,
        data: this.data,
        attributes: this.value,
        selected: selected,
        reorder: reorder,
        value: item,
      })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _getRawValue(value) {
    let data = null;
    if(this.multiple) {
      if (Array.isArray(this.value)) {
        data = value.map((item) => {
          return item.toJSON();
        });
      }
    } else {
      data = value ? value.toJSON() : null;
    }

    return data;
  }
}
