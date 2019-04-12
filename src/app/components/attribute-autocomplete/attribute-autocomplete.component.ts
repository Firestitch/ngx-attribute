import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil, map, debounceTime } from 'rxjs/operators';
import { isEmpty } from 'lodash-es';

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

  @ViewChild('searchInput')
  public input: ElementRef;

  @Input()
  public data;

  @Input()
  set class(value) {
    this.options = [];
    this.klass = value;
  }

  @Input()
  public label = 'Select...';

  @Input()
  public required = false;

  public klass;
  public attributeConfig: AttributeConfigItem;
  public options = [];
  public inputValue = '';
  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _value;
  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private _renderer: Renderer2,
  ) {}

  set value(value) {
    if (this._value !== value) {
      this._value = value;

      const data = this.value ? this.value.toJSON() : null;
      this.onChange(data);
      this.onTouch(data);
    }
    this.updateView();
  }

  get value() {
    return this._value;
  }

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    if (!this.label) {
      this.label = this.attributeConfig.name;
    }

    this._listenInputChanges();
  }

  public blur() {
    this.updateView();
  }

  public updateView() {
    let display = '';

    if (this.value) {

      if (this.value.parent) {
        display = this.value.parent.name + ': ';
      }

      display += this.value.name;
    }

    this._renderer.setProperty(this.input.nativeElement, 'value', display);
  }

  public select(e: MatAutocompleteSelectedEvent) {
    this.value = e.option.value;
  }

  public fetch = (keyword) => {

    this.attributesConfig.getAttributes({
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
      .subscribe(e => {
        this.options = e;
      });
  };

  public writeValue(value) {
    if (value !== this.value) {
      this._value = value
        ? new AttributeItem(value, this.attributesConfig)
        : value;

      this.updateView();
    }
  }

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _listenInputChanges() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(300)
      )
      .subscribe(() => {

        const keyword = this.input.nativeElement.value;

        if (isEmpty(keyword)) {
          this.options = [];
          this.value = null;
        }

        this.fetch(keyword);
      });
  }

}
