import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter, forwardRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { wrapAttributes } from '../../helpers/helpers';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';



@Component({
  selector: 'fs-attribute-select',
  templateUrl: './attribute-select.component.html',
  styleUrls: [ './attribute-select.component.scss' ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FsAttributeSelectComponent),
    multi: true
  }]
})
export class FsAttributeSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  public attributes: any = [];
  public attributeConfig: any = {};
  public label = '';
  private destroy$ = new Subject();
  private onChange: any = () => {}
  private onTouch: any = () => {}

  @Input() ngModel;
  @Input() required = false;
  @Input() noneOption = false;
  @Input() data;
  @Input('class') class;
  @Output() changed = new EventEmitter();

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {}

  ngOnInit() {

    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.class })[0] || {};
    this.label = this.attributeConfig.name;

    const e = {
      data: this.data,
      class: this.class
    };

    this.fsAttributeConfig.getAttributes(e)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((response) => {
      this.attributes =  wrapAttributes(this.fsAttributeConfig, response.data);
    });
  }

  public compare = (o1: any, o2: any) => {
    return this.fsAttributeConfig.compareAttributes(o1, o2);
  }

  selectionChange(e) {
    this.onChange(e);
    this.changed.emit(this.ngModel);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: any) {}

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn
  }
}
