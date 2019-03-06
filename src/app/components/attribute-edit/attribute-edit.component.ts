import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { filter } from 'lodash-es';

@Component({
  templateUrl: 'attribute-edit.component.html',
  styleUrls: [ 'attribute-edit.component.scss' ]
})
export class FsAttributeEditComponent implements OnInit {

  public attribute = {};
  public attributeConfig = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeEditComponent>) {
    this.attribute = this.data.attribute || {};
  }

  ngOnInit() {
    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.data.class })[0] || {};
  }

  selectImage(file) {
    this.fsAttributeConfig.attributeImageSave(this.attribute, file);
  }

  save() {
    this.fsAttributeConfig.attributeSave(this.attribute);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
