import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { ReorderPosition, ReorderStrategy, FsListConfig, FsListComponent } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { AttributeOrder } from '../../enums/enums';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';

import { FsAttributeListColumnDirective } from '../../directives/list-column.directive';

@Component({
  selector: 'fs-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: [ './attribute-list.component.scss' ]
})
export class FsAttributeListComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  public list: FsListComponent;

  @ContentChild(FsAttributeListColumnDirective, { read: TemplateRef })
  columnTemplate: TemplateRef<any>;

  @Input('class')
  public klass: string;

  @Input()
  public data: string;

  public listConfig: FsListConfig;
  // public listItems
  public attributeConfig: AttributeConfigItem = null;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    this._setListConfig();
  }

  public edit(attribute) {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        klass: this.klass,
        data: this.data,
        mode: 'edit',
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
    });

    dialogRef.afterClosed().subscribe(response => {
      const attr = new AttributeItem(response.attribute, attribute.attributesConfig);
      this.list.replaceRow(attr, (listRow) => listRow.id === attribute.id);
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setListConfig() {
    const config: FsListConfig = {
      status: true,
      paging: {
        limits: [ 50, 100, 200, 500, 1000 ] // TAD-T796
      },
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
                attribute: new AttributeItem({ class: this.klass }, this.attributesConfig),
                klass: this.klass,
                data: this.data,
                mode: 'create',
              },
              panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
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
            return this._deleteRow(row);
          },
          remove: true,
          icon: 'delete',
          label: 'Remove'
        }
      ],
      fetch: (query) => {


        if (this.attributeConfig.order == AttributeOrder.Alphabetical) {
          query.order = 'name,asc';
        } else if (this.attributeConfig.order == AttributeOrder.Custom) {
          query.order = 'order,asc';
        }

        const e = {
          query: query,
          data: this.data,
          class: this.klass
        };

        return this.attributesConfig.getAttributes(e)
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
            class: this.klass
          };

          this.attributesConfig.reorderAttributes(e)
            .pipe(
              takeUntil(this._destroy$)
            )
            .subscribe(() => {

            });
        }
      };
    }

    this.listConfig = config;
  }

  /**
   * Biggest cratch in the world. Let's remove it in new future
   */
  private _deleteRow(row) {
    return new Observable((obs) => {
      this.attributesConfig.deleteConfirmation(row)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: () => {
            this.attributesConfig.deleteAttribute(row).subscribe(() => {
              obs.next();
            })
          },
          error: () => {},
        })
    });
  }
}
