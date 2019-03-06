import { Component, Inject, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig, AttributeConfig, AttributeOrder } from '../../interfaces/attribute-config.interface';
import { filter } from 'lodash-es';
import { map } from 'rxjs/operators';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { ReorderPosition, ReorderStrategy, FsListConfig } from '@firestitch/list';

@Component({
  selector: 'fs-attribute-list',
  templateUrl: 'attribute-list.component.html',
  styleUrls: [ 'attribute-list.component.scss' ]
})
export class FsAttributeListComponent implements OnInit {

  @ViewChild('list') list;
  @Input() class: string;
  public listConfig: FsListConfig;
  public attributeConfig: AttributeConfig = null;

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialog: MatDialog) {}

  ngOnInit() {

    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.class })[0] || {};

    this.listConfig = {
      status: false,
      filters: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Search'
        }
      ],
      actions: [
        {
          label: 'Create ' + this.attributeConfig.pluralName,
          click: () => {
            const dialogRef = this.dialog.open(FsAttributeEditComponent, {
              data: {
                attibute: {},
                class: this.class
              }
            });

            dialogRef.afterClosed().subscribe(response => {
              this.list.reload();
            });
          }
        }
      ],
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

        return this.fsAttributeConfig.attributesFetch(query)
          .pipe(
            map((response: any) => ({ data: response.data, paging: response.paging }))
          );
      }
    };

    if (this.attributeConfig.order === AttributeOrder.Custom) {
      this.listConfig.reorder = {
        position: ReorderPosition.Left,
        strategy: ReorderStrategy.Always,
        done: (data) => {
          this.fsAttributeConfig.attributesReorder(data);
        }
      }
    }
  }

  edit(attribute) {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        class: this.class
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.list.reload();
    });
  }
}
