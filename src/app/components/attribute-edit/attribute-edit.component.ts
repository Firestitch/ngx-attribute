import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { randomColor } from '@firestitch/colorpicker';

import { of, Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';

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
  public saving = false;
  public parentSelector: string;
  public selectedParent: AttributeItem;
  public inEditMode = false;

  public get title() {
    return `${this.inEditMode ? 'Edit' : 'Create'} ${this.attributeConfig?.name.toLowerCase()}`;
  }
  
  private _destroy$ = new Subject<void>();

  constructor(
    private _attributesConfig: AttributesConfig,
    @Inject(MAT_DIALOG_DATA) private _data: {
      attributeConfig: AttributeConfigItem;
      attribute: AttributeItem;
      parent: AttributeItem;
      mode: string;
      selectParent: string;
      data: any;
    },
    private _dialogRef: MatDialogRef<FsAttributeEditComponent>,
    private _cd: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    const attribute = this._data.attribute;
    this.attributeConfig = this._data.attributeConfig;
    this.attribute = attribute && cloneDeep(attribute) || {};

    if (this._data.parent) {
      this.selectedParent = new AttributeItem(this._data.parent, this.attributeConfig.parent);
    }

    this.inEditMode = this._data.mode === 'edit';

    this.parentSelector = this._data.selectParent;

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
    
    this.saving = true;
    of(null)
      .pipe(
        switchMap(() => this._attributesConfig.saveAttributeImage(data)),
        finalize(() => {
          this.saving = false;
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

  public save() {
    // const mapping = this.fsAttributeConfig.mapping;
    //
    // this.attribute[mapping.name] = this.name;
    // this.attribute[mapping.backgroundColor] = this.backgroundColor;

    this.saveAttribute();
  }

  public saveAttribute$() {
    const parent = getRawAttributeValue(this.selectedParent);

    const eventData = {
      attribute: this.attribute,
      class: this.attributeConfig.class,
      data: this._data.data,
      parent,
    };

    return this._attributesConfig.saveAttribute(eventData);
  }

  public saveAttribute() {
    this.saveAttribute$()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response: any) => {
        response.parent = this.selectedParent;
        this.close(response);
      });
  }

  public close(data = null) {
    this._dialogRef.close(data);
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
