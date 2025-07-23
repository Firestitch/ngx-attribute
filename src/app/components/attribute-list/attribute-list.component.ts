import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  EnvironmentInjector,
  inject,
  Input,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { FsAttributeListColumnDirective } from '../../directives/list-column.directive';
import { AttributeOrder } from '../../enums/enums';
import { AttributeConfig, FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { FsAttributeListAction } from '../../interfaces/list-action.interface';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';


@Component({
  selector: 'fs-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeListComponent implements OnInit, OnDestroy {

  @ViewChild(FsListComponent, { static: true })
  public list: FsListComponent;

  @ContentChild(FsAttributeListColumnDirective, { read: TemplateRef })
  public columnTemplate: TemplateRef<any>;

  @Input('class')
  public class: string;

  @Input()
  public actions: FsAttributeListAction[] = [];

  @Input()
  public config: AttributeConfig;

  @Input()
  public attributeConfig: FsAttributeConfig;

  @Input()
  public data: any;

  @Input()
  public size: 'small' | 'tiny';

  @Input() public queryParam: boolean = null;

  public listConfig: FsListConfig;
  public attributeItemConfig: AttributeConfigItem = null;

  private _destroy$ = new Subject();
  private _attributeService = inject(AttributeService);
  private _dialog = inject(MatDialog);
  private _cdRef = inject(ChangeDetectorRef);
  private _data = inject(MAT_DIALOG_DATA, { optional: true });
  private _envInj = inject(EnvironmentInjector);

  public ngOnInit() {
    this._attributeService = this.attributeConfig ? 
      runInInjectionContext(this._envInj, () =>  (new AttributeService()).init(this.attributeConfig)) :
      this._attributeService;

    this.class = this._data?.class || this.class;
    this.data = this._data?.data || this.data;
    this.attributeItemConfig = this._data?.attributeConfig || (
      this.config ?
        new AttributeConfigItem(this.config) :
        this._attributeService.getConfig(this.class)
    );

    this._setListConfig();
  }

  public edit(attribute: AttributeItem) {
    this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        attributeConfig: this.attributeItemConfig,
        data: this.data,
        mode: 'edit',
      },
      panelClass: [
        'fs-attribute-dialog',
        'fs-attribute-dialog-no-scroll',
        `fs-attribute-${this.attributeItemConfig.class}`,
      ],
    })
      .afterClosed()
      .pipe(
        filter((response) => !!response),
      )
      .subscribe((response) => {
        const attr = new AttributeItem(response.attribute, this.attributeItemConfig);
        this.list.replaceRow(attr, (listRow) => listRow.id === attribute.id);

        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public create() {
    this
      ._createAttribute({
        data: this.data,
      })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.list.reload();
      });
  }

  private _setListConfig() {
    const config: FsListConfig = {
      reload: false,
      status: false,
      style: 'card',
      paging: {
        limits: [50, 100, 200, 500, 1000],
      },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      rowActions: [
        {
          click: (row) => {
            return this._deleteRow(row);
          },
          remove: true,
          label: 'Remove',
        },
      ],
      actions: this.actions,
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (attributeItem: AttributeItem) => {
          attributeItem.state = 'active';

          return this._attributeService
            .saveAttribute({
              attribute: attributeItem,
              class: this.attributeItemConfig.class,
              data: this.data,
            });
        },
      },
      fetch: (query) => {
        if (this.attributeItemConfig.order === AttributeOrder.Alphabetical) {
          query.order = 'name,asc';
        } else if (this.attributeItemConfig.order === AttributeOrder.Custom) {
          query.order = 'order,asc';
        }

        const e = {
          query: query,
          data: this.data,
          class: this.attributeItemConfig.class,
        };

        return this._attributeService.getAttributes(e, this.attributeItemConfig)
          .pipe(
            map((response: any) => ({ data: response.data, paging: response.paging })),
          );
      },
    };

    if (this.attributeItemConfig.order === AttributeOrder.Custom) {
      config.reorder = {
        done: (data) => {
          const e = {
            attributes: data,
            data: this.data,
            class: this.class,
          };

          this._attributeService.reorderAttributes(e)
            .pipe(
              takeUntil(this._destroy$),
            )
            .subscribe();
        },
      };
    }

    if (this.queryParam !== null) {
      config.queryParam = this.queryParam;
    }

    this.listConfig = config;
  }

  private _deleteRow(row) {
    return this._attributeService.deleteConfirmation(row)
      .pipe(
        switchMap(() => this._attributeService.deleteAttribute(row)),
        takeUntil(this._destroy$),
      );
  }

  private _createAttribute(
    config: { data?: any } = {},
  ): MatDialogRef<FsAttributeEditComponent> {
    return this._dialog
      .open(FsAttributeEditComponent, {
        data: {
          attribute: new AttributeItem({
            class: this.attributeItemConfig.class,
          }, this.attributeItemConfig),
          attributeConfig: this.attributeItemConfig,
          data: config.data,
          mode: 'create',
          attributeService: this._attributeService,
        },
        panelClass: [
          'fs-attribute-dialog',
          'fs-attribute-dialog-no-scroll',
          `fs-attribute-${this.attributeItemConfig.class}`,
        ],
      });
  }
}
