import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

import { fromEvent, Subject } from 'rxjs';
import { takeUntil, map, debounceTime } from 'rxjs/operators';
import { isEmpty } from 'lodash-es';

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

  public keyword$ = new Subject<Event>();

  private _value;
  private _destroy$ = new Subject();

  constructor(public attributesConfig: AttributesConfig) {}

  set value(value) {
    this._value = value;
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
    this.inputValue = '';

    if (this.value) {

      if (this.value.parent) {
        this.inputValue = this.value.parent.name + ': ';
      }

      this.inputValue += this.value.name;
    }
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

  private _listenInputChanges() {
    fromEvent(this.input.nativeElement, 'keyup')
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

}
