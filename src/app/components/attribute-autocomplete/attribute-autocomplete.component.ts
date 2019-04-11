import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil, map, debounceTime } from 'rxjs/operators';
import { isEmpty } from 'lodash-es';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { MatAutocompleteSelectedEvent } from '@angular/material';


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

  @ViewChild('input') input: ElementRef;
  @Input()
  public data;

  @Input('class') set setClass(value) {
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
  public onChange: any = () => {};
  public onTouch: any = () => {};

  private _value;
  public inputModel = '';
  public keyword$ = new Subject<Event>();
  private _destroy$ = new Subject();

  constructor(public attributesConfig: AttributesConfig,
              private renderer: Renderer2) {}

  set value(value) {
    this._value = value;
    this.updateView();
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

    this.renderer.setProperty(this.input.nativeElement, 'value', display);
  }

  public select(e: MatAutocompleteSelectedEvent) {
    this.change(e.option.value);
  }

  public change(value) {
    this.value = value;
    const data = this.value ? this.value.toJSON() : null;
    this.onChange(data);
    this.onTouch(data);
  }

  get value() {
    return this._value;
  }

  public ngOnInit() {

    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    if (!this.label) {
      this.label = this.attributeConfig.name;
    }

    this.keyword$
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(300)
      )
      .subscribe((e: KeyboardEvent) => {

        const keyword = this.input.nativeElement.value;

        if (isEmpty(keyword)) {
          this.options = [];
          this.change(null);
        }

        this.fetch(keyword);
      });
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
    this.value = value;
  }

  public compare = (o1: any, o2: any) => {
    return this.attributesConfig.compareAttributes(o1, o2);
  };

  public registerOnChange(fn) { this.onChange = fn;  }
  public registerOnTouched(fn) { this.onTouch = fn; }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
