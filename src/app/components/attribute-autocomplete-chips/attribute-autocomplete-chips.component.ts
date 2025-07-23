import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EnvironmentInjector,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  forwardRef,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { AttributeConfig, FsAttributeConfig } from '../../interfaces';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeManageComponent } from '../attribute-manage';

import { FsAttributeAutocompleteChipsStaticDirective } from './../../directives';

@Component({
  selector: 'fs-attribute-autocomplete-chips',
  templateUrl: './attribute-autocomplete-chips.component.html',
  styleUrls: ['./attribute-autocomplete-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsAttributeAutocompleteChipsComponent),
      multi: true,
    },
  ],
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

  @Input()
  public attributeConfig: FsAttributeConfig;

  public onChange: (value: any) => void;
  public onTouch: (value: any) => void;

  private _value;
  private _attributeItemConfig: AttributeConfigItem;
  private _destroy$ = new Subject();
  private _attributeService = inject(AttributeService);
  private _cdRef = inject(ChangeDetectorRef);
  private _dialog = inject(MatDialog);
  private _envInj = inject(EnvironmentInjector);

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
    this._attributeService = this.attributeConfig ? 
      runInInjectionContext(this._envInj, () =>  (new AttributeService()).init(this.attributeConfig)) :
      this._attributeService;

    this._attributeItemConfig = this.config ? 
      new AttributeConfigItem(this.config) : 
      this._attributeService.getConfig(this.class);

    if (!this.label) {
      this.label = this._attributeItemConfig.name;
    }

    if (!this.background && this._attributeItemConfig.backgroundColor) {
      this.background = this._attributeItemConfig.mapping.backgroundColor;
    }

    if (!this.color && this._attributeItemConfig.color) {
      this.color = this._attributeItemConfig.mapping.color;
    }

    this.label = this.label || 
      (this.multiple ? this._attributeItemConfig.pluralName : this._attributeItemConfig.name);
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public fetch = (keyword) => {
    return this._attributeService
      .getAttributes({
        class: this._attributeItemConfig.class,
        data: this.data,
        keyword: keyword,
      }, this._attributeItemConfig)
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
          value.map((item) => new AttributeItem(item, this._attributeItemConfig)) : [];
      } else {
        this._value = new AttributeItem(value, this._attributeItemConfig);
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
    return this._attributeService.compareAttributes(o1, o2);
  };

  public registerOnChange(fn) {
    this.onChange = fn;  
  }
  public registerOnTouched(fn) {
    this.onTouch = fn; 
  }

  public manage() {
    this._dialog
      .open(FsAttributeManageComponent, {
        data: {
          attributeConfig: this._attributeItemConfig,
          data: this.data,
          size: this.size,
          attributeService: this._attributeService,  
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
    this._attributeService
      .attributeSelectionChanged({
        class: this._attributeItemConfig.class,
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
