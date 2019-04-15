import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, merge } from 'lodash-es';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';
import { getRawAttributeValue } from '../../helpers/raw-attribute-value';


@Component({
  templateUrl: './attribute-edit.component.html',
  styleUrls: [ './attribute-edit.component.scss' ]
})
export class FsAttributeEditComponent implements OnInit, OnDestroy {

  public attribute: AttributeItem;
  public attributeConfig: AttributeConfigItem;
  public saving = false;
  public parentSelector: string;
  public selectedParent: AttributeItem;

  private _destroy$ = new Subject<void>();

  constructor(
    public attributesConfig: AttributesConfig,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FsAttributeEditComponent>,
    private _cd: ChangeDetectorRef,
  ) {
    const attribute = this.data.attribute;
    this.attribute = attribute && cloneDeep(attribute) || {};

    if (this.data.parent) {
      this.selectedParent = new AttributeItem(this.data.parent, attributesConfig);
    }

    this.parentSelector = this.data.selectParent;
  }

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.data.klass);
  }

  public selectImage(file) {

    const e = {
      attribute: this.attribute,
      class: this.data.klass,
      data: this.data.data,
      file: file
    };

    this.saving = true;
    this.attributesConfig.saveAttributeImage(e)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response: any) => {
        const attribute = merge(this.attribute.toJSON(), response);
        this.attribute = new AttributeItem(attribute, this.attributesConfig);
        this._cd.detectChanges();
      },
      () => {},
      () => {
        this.saving = false;
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
      class: this.data.klass,
      data: this.data.data,
      parent: parent,
    };

    this.attributesConfig.saveAttribute(eventData)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: any) => {
        response.parent = this.selectedParent;
        this.close(response);
      });
  }

  public close(data = null) {
    this.dialogRef.close(data);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
