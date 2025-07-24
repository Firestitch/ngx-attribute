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
import { AttributeModel } from '../../models/attribute';
import { AttributeConfigModel } from '../../models/attribute-config';
import { AttributeService } from '../../services';


@Component({
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeEditComponent implements OnInit, OnDestroy {

  public attribute: AttributeModel;
  public attributeConfig: AttributeConfigModel;
  public selectedParent: AttributeModel;
  public inEditMode = false;
  public attributeService: AttributeService;

  public get title() {
    return `${this.inEditMode ? 'Edit' : 'Create'} ${this.attributeConfig?.name.toLowerCase()}`;
  }
  
  private _data = inject<{
    attributeConfig: AttributeConfigModel;
    attribute: AttributeModel;
    parent: AttributeModel;
    mode: string;
    data: any;
    attributeService: AttributeService;
  }>(MAT_DIALOG_DATA, { optional: true });
  private _dialogRef = inject(MatDialogRef<FsAttributeEditComponent>);
  private _cd = inject(ChangeDetectorRef);
  private _attributeService = inject(AttributeService);
  private _destroy$ = new Subject<void>();

  public ngOnInit() {
    const attribute = this._data.attribute;
    this.attributeConfig = this._data.attributeConfig;
    this.attributeService = this._data.attributeService || this._attributeService;
    this.attribute = attribute && cloneDeep(attribute) || {};

    if (this._data.parent) {
      this.selectedParent = new AttributeModel(this._data.parent, this.attributeConfig.parent);
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
        switchMap(() => this.attributeService.saveAttributeImage(data)),
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
        
        this.attribute = new AttributeModel(attribute, this.attributeConfig);
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

    return this.attributeService.saveAttribute(eventData)
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
