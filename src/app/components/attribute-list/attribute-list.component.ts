import { Component, Inject, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ReorderPosition, ReorderStrategy, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { FsAttributeConfig, AttributeConfig } from '../../interfaces/attribute-config.interface';
import { AttributeOrder } from '../../enums/enums';

@Component({
  selector: 'fs-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: [ './attribute-list.component.scss' ]
})
export class FsAttributeListComponent implements OnInit, OnDestroy {

  @ViewChild('list') list;
  @Input() class: string;
  @Input() data: string;
  public listConfig: FsListConfig;
  // public listItems
  public attributeConfig: AttributeConfig = null;

  private destroy$ = new Subject();

  constructor(
    @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.class })[0] || {};

    this._setListConfig();
  }

  public edit(attribute) {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        class: this.class,
        data: this.data,
        type: 'list',
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(response => {
        this.list.reload();
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _setListConfig() {
    const config: any = {
      status: false,
      filters: [
        {
          name: 'keyword',
          type: ItemType.Text,
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
                data: this.data,
                type: 'list',
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
            const dialogRef = this.dialog.open(FsAttributeEditComponent, {
              data: {
                attribute: row,
                class: this.class,
              }
            });

            dialogRef.afterClosed().subscribe(response => {
              this.list.reload();
            });
          },
          icon: 'edit',
          label: 'Edit'
        },
        {
          click: (row, event) => {
            return this.fsAttributeConfig.deleteAttribute(row);
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
      config.reorder = {
        position: ReorderPosition.Left,
        strategy: ReorderStrategy.Always,
        done: (data) => {

          const e = {
            attributes: data,
            data: this.data,
            class: this.class
          };

          this.fsAttributeConfig.reorderAttributes(e)
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe(() => {

            });
        }
      };
    }

    this.listConfig = config;
  }
}
