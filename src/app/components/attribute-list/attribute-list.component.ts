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
  @Input() data: string;
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
          label: 'Create ' + this.attributeConfig.name,
          click: () => {
            const dialogRef = this.dialog.open(FsAttributeEditComponent, {
              data: {
                attibute: {},
                class: this.class,
                data: this.data
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
            const e = {
              attribute: row,
              data: this.data,
              class: this.class
            };

            return this.fsAttributeConfig.deleteAttribute(e);
          },
          remove: true,
          icon: 'delete',
          label: 'Remove'
        }
      ],
      fetch: (query) => {
        const e = {
          query: query,
          data: this.data,
          class: this.class
        };

        return this.fsAttributeConfig.getAttributes(e)
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

          const e = {
            attributes: data,
            data: this.data,
            class: this.class
          };
          this.fsAttributeConfig.reorderAttributes(e);
        }
      }
    }
  }

  edit(attribute) {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        class: this.class,
        data: this.data
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      this.list.reload();
    });
  }
}
