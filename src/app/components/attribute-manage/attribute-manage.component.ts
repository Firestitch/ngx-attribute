import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';

@Component({
  templateUrl: './attribute-manage.component.html',
  styleUrls: [ './attribute-manage.component.scss' ]
})
export class FsAttributeManageComponent implements OnInit {

  public listConfig = {};
  public attributeConfig = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeManageComponent>) {
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
