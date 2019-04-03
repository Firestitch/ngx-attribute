import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter, cloneDeep } from 'lodash-es';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { getAttributeValue } from '../../helpers/helpers';


@Component({
  templateUrl: './attribute-edit.component.html',
  styleUrls: [ './attribute-edit.component.scss' ]
})
export class FsAttributeEditComponent implements OnInit, OnDestroy {

  public attribute: any;
  public attributeConfig: any;
  public image;
  public backgroundColor;
  public name;
  public id;

  private destroy$ = new Subject();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeEditComponent>) {
    const attribute = this.data.attribute;
    this.attribute = attribute && cloneDeep(attribute) || {};
  }

  ngOnInit() {
    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.data.class })[0] || {};

    const mapping = this.fsAttributeConfig.mapping;

    this.id = getAttributeValue(this.attribute, mapping.id);
    this.name = getAttributeValue(this.attribute, mapping.name);
    this.backgroundColor = getAttributeValue(this.attribute, mapping.backgroundColor);
    this.image = getAttributeValue(this.attribute, mapping.image);
  }

  selectImage(file) {

    const e = {
      attribute: this.attribute,
      class: this.data.class,
      data: this.data.data,
      file: file
    };

    this.fsAttributeConfig.saveAttributeImage(e)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((attribute) => {
        this.attribute = attribute;
      });
  }

  save() {
    const mapping = this.fsAttributeConfig.mapping;

    this.attribute[mapping.name] = this.name;
    this.attribute[mapping.backgroundColor] = this.backgroundColor;

    this.saveAttribute();
  }

  public saveAttribute() {

    const eventData = {
      attribute: this.attribute,
      class: this.data.class,
      data: this.data.data,
      parent: this.data.parent,
    };

    this.fsAttributeConfig.saveAttribute(eventData)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.close(response);
      });
  }

  close(data = null) {
    this.dialogRef.close(data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
