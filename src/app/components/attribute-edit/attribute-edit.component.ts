import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { randomColor } from '@firestitch/colorpicker';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { cloneDeep, merge } from 'lodash-es';

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

  @ViewChild('submitButton') public submitButton: MatButton = null;

  private _destroy$ = new Subject<void>();

  constructor(
    public attributesConfig: AttributesConfig,
    @Inject(MAT_DIALOG_DATA) public data: {
      attributeConfig: AttributeConfigItem;
      attribute: AttributeItem;
      parent: AttributeItem;
      mode: string;
      selectParent: string;
      queryConfigs: any;
      data: any;
    },
    private _dialogRef: MatDialogRef<FsAttributeEditComponent>,
    private _cd: ChangeDetectorRef,
  ) {
    const attribute = this.data.attribute;
    this.attributeConfig = this.data.attributeConfig;
    this.attribute = attribute && cloneDeep(attribute) || {};

    if (this.data.parent) {
      this.selectedParent = new AttributeItem(this.data.parent, this.attributeConfig.parent);
    }

    this.inEditMode = this.data.mode === 'edit';

    this.parentSelector = this.data.selectParent;
  }

  public ngOnInit() {
    if(
      !this.inEditMode && 
      this.attributeConfig.backgroundColor && 
      !this.attribute.backgroundColor
    ) {
      this.attribute.backgroundColor = randomColor();
    }
  }

  public selectImage(file) {
    const e = {
      attribute: this.attribute,
      class: this.attributeConfig.class,
      data: this.data.data,
      file: file,
      queryConfigs: this.data?.queryConfigs,
    };

    this.saving = true;
    this.attributesConfig.saveAttributeImage(e)
      .pipe(
        finalize(() => {
          this.saving = false;
          this._cd.markForCheck();
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((response: any) => {
        this.submitButton.disabled = false;

        // TAD-T527 prevent loss config object link (was passed into attribute component wrapper
        if (Array.isArray(response.configs)) {
          delete response.configs;
        }

        const attribute = merge(response, this.attribute.toJSON());
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

  public saveAttribute() {

    const parent = getRawAttributeValue(this.selectedParent);

    const eventData = {
      attribute: this.attribute,
      class: this.attributeConfig.class,
      data: this.data.data,
      parent: parent,
      queryConfigs: this.data?.queryConfigs,
    };

    this.attributesConfig.saveAttribute(eventData)
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
