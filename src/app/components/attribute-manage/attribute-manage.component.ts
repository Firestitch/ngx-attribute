import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { filter } from 'lodash-es';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: 'attribute-manage.component.html',
  styleUrls: [ 'attribute-manage.component.scss' ]
})
export class FsAttributeManageComponent implements OnInit {

  public listConfig = {};
  public attributeConfig = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeManageComponent>) {
  }

  ngOnInit() {
    const attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.data.class })[0];

    this.listConfig = {
      status: false,
      // actions: [
      //   {
      //     label: 'Update Row (Object 3)',
      //     click: () => {
      //       this.table.updateData(
      //         { name: 'Object 3 Updated' },
      //         (listRow: any) => {
      //           return listRow.name === 'Object 3';
      //         }
      //       );
      //     }
      //   },
      //   {
      //     label: 'Remove Row (Object 2)',
      //     click: () => {
      //       this.table.removeData(
      //         (listRow: any) => {
      //           return listRow.name === 'Object 2';
      //         }
      //       );
      //     }
      //   }
      //],
      rowActions: [
        {
          click: (row, event) => {
            return this.fsAttributeConfig.attributeDelete(row);
          },
          remove: true,
          icon: 'delete',
          label: 'Remove'
        }
      ],
      fetch: (query) => {
        query.count = 500;
        return this.fsAttributeConfig.attributesFetch(query)
          .pipe(
            map((response: any) => ({ data: response.data, paging: response.paging }))
          );
      },
    };

  }

  close() {
    this.dialogRef.close();
  }
}
