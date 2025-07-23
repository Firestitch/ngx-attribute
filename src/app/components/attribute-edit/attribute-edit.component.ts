import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { randomColor } from '@firestitch/colorpicker';

import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import { getRawAttributeValue } from '../../helpers/raw-attribute-value';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';


@Component({
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeEditComponent implements OnInit, OnDestroy {

  public attribute: AttributeItem;
  public attributeConfig: AttributeConfigItem;
  public selectedParent: AttributeItem;
  public inEditMode = false;
  public attributesConfig: AttributesConfig;

  public get title() {
    return `${this.inEditMode ? 'Edit' : 'Create'} ${this.attributeConfig?.name.toLowerCase()}`;
  }
  
  private _data = inject<{
    attributeConfig: AttributeConfigItem;
    attribute: AttributeItem;
    parent: AttributeItem;
    mode: string;
    data: any;
    attributesConfig: AttributesConfig;
  }>(MAT_DIALOG_DATA, { optional: true });
  private _dialogRef = inject(MatDialogRef<FsAttributeEditComponent>);
  private _cd = inject(ChangeDetectorRef);
  private _attributesConfig = inject(AttributesConfig);
  private _destroy$ = new Subject<void>();

  public ngOnInit() {
    const attribute = this._data.attribute;
    this.attributeConfig = this._data.attributeConfig;
    this.attributesConfig = this._data.attributesConfig || this._attributesConfig;
    this.attribute = attribute && cloneDeep(attribute) || {};

    if (this._data.parent) {
      this.selectedParent = new AttributeItem(this._data.parent, this.attributeConfig.parent);
    }

    this.inEditMode = this._data.mode === 'edit';

    if(
      !this.inEditMode && 
      this.attributeConfig.backgroundColor && 
      !this.attribute.backgroundColor
    ) {
      this.attribute.backgroundColor = randomColor();
    }
  }

  public selectImage(file) {
    const data = {
      attribute: this.attribute,
      class: this.attributeConfig.class,
      data: this._data.data,
      file: file,
    };
    
    of(null)
      .pipe(
        switchMap(() => this.attributesConfig.saveAttributeImage(data)),
        finalize(() => {
          this._cd.markForCheck();
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((attribute: any) => {
        attribute = {
          ...attribute,
          configs: {},
          ...this.attribute.toJSON(),
        };
        
        this.attribute = new AttributeItem(attribute, this.attributeConfig);
      });
  }

  public save = () => {
    const parent = getRawAttributeValue(this.selectedParent);

    const eventData = {
      attribute: this.attribute,
      class: this.attributeConfig.class,
      data: this._data.data,
      parent,
    };

    return this.attributesConfig.saveAttribute(eventData)
      .pipe(
        tap((response) => {
          this.close(response);
        }),
      );
  };

  public close(data = null) {
    this._dialogRef.close(data);
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
