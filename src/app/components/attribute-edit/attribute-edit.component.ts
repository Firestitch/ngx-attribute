import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { filter } from 'lodash-es';
import { getAttributeValue } from '../../helpers/helpers';

@Component({
  templateUrl: 'attribute-edit.component.html',
  styleUrls: [ 'attribute-edit.component.scss' ]
})
export class FsAttributeEditComponent implements OnInit {

  public attribute: any;
  public attributeConfig: any;
  public image;
  public backgroundColor;
  public name;
  public id;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeEditComponent>) {
    this.attribute = this.data.attribute || {};
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

    this.fsAttributeConfig.saveAttributeImage(e);
  }

  save() {

    const mapping = this.fsAttributeConfig.mapping;

    this.attribute[mapping.name] = this.name;
    this.attribute[mapping.backgroundColor] = this.backgroundColor;

    const e = {
      attribute: this.attribute,
      class: this.data.class,
      data: this.data.data
    };

    this.fsAttributeConfig.saveAttribute(e);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
