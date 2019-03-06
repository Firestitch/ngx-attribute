import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig, AttributeConfig } from '../../interfaces/attribute-config.interface';
import { FsAttributeManageComponent } from '../attribute-manage/attribute-manage.component';
import { filter } from 'lodash-es';

@Component({
  templateUrl: 'attribute-selector.component.html',
  styleUrls: [ 'attribute-selector.component.scss' ]
})
export class FsAttributeSelectorComponent implements OnInit {

  public selectedAttributes = [];
  public attributes = [];
  public attributeConfig: AttributeConfig = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeSelectorComponent>,
              private dialog: MatDialog) {
    this.selectedAttributes = this.data.selectedAttributes;
  }

  ngOnInit() {

    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.data.class })[0] || {};

    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(result => {
      this.done();
    });

    this.fetch();
  }

  private fetch() {

    this.fsAttributeConfig.attributesFetch({})
    .subscribe(response => {
      this.attributes = response.data;
    });
  }

  done() {
    this.dialogRef.close({ attributes: this.selectedAttributes });
  }

  create() {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attibute: {},
        class: this.data.class,
        config: this.data.config
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.fetch();
    });
  }

  manage() {
    const dialogRef = this.dialog.open(FsAttributeManageComponent, {
      data: {
        class: this.data.class
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.fetch();
    });
  }
}
