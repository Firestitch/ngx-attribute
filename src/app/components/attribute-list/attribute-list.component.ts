import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
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
import { AttributeConfig } from '../../interfaces/attribute-config.interface';
import { FsAttributeListAction } from '../../interfaces/list-action.interface';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
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
  public data: any;

  @Input()
  public size: 'small' | 'tiny';

  @Input()
  public queryConfigs: any;

  @Input() public queryParam: boolean = null;

  public listConfig: FsListConfig;
  public attributeConfig: AttributeConfigItem = null;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public dialogData: any,
  ) { }

  public ngOnInit() {
    this.class = this.dialogData?.class || this.class;
    this.data = this.dialogData?.data || this.data;
    this.queryConfigs = this.dialogData?.queryConfigs || this.queryConfigs;
    this.attributeConfig = this.dialogData?.attributeConfig || (
      this.config ? 
        new AttributeConfigItem(this.config, this.config.mapping) : 
        this.attributesConfig.getConfig(this.class)
    );

    this._setListConfig();
  }

  public edit(attribute: AttributeItem) {
    this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        attributeConfig: this.attributeConfig,
        data: this.data,
        mode: 'edit',
        queryConfigs: this.queryConfigs,
      },
      panelClass: [
        'fs-attribute-dialog', 
        'fs-attribute-dialog-no-scroll', 
        `fs-attribute-${this.attributeConfig.class}`,
      ],
    })
      .afterClosed()
      .pipe(
        filter((response) => !!response),
      )
      .subscribe((response) => {
        const attr = new AttributeItem(response.attribute, this.attributeConfig);
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
        queryConfigs: this.queryConfigs,
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
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (attributeItem: AttributeItem) => {
          attributeItem.state = 'active';

          return this.attributesConfig
            .saveAttribute({
              attribute: attributeItem,
              class: this.attributeConfig.class,
              data: this.data,
              queryConfigs: this.queryConfigs,
            });
        },
      },
      fetch: (query) => {
        if (this.attributeConfig.order === AttributeOrder.Alphabetical) {
          query.order = 'name,asc';
        } else if (this.attributeConfig.order === AttributeOrder.Custom) {
          query.order = 'order,asc';
        }

        const e = {
          query: query,
          data: this.data,
          class: this.attributeConfig.class,
          queryConfigs: this.queryConfigs,
        };

        return this.attributesConfig.getAttributes(e, this.attributeConfig)
          .pipe(
            map((response: any) => ({ data: response.data, paging: response.paging })),
          );
      },
    };

    if (this.attributeConfig.order === AttributeOrder.Custom) {
      config.reorder = {
        done: (data) => {
          const e = {
            attributes: data,
            data: this.data,
            class: this.class,
            queryConfigs: this.queryConfigs,
          };

          this.attributesConfig.reorderAttributes(e)
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
    return this.attributesConfig.deleteConfirmation(row)
      .pipe(
        switchMap(() => this.attributesConfig.deleteAttribute(row)),
        takeUntil(this._destroy$),
      );
  }

  private _createAttribute(
    config: { data?: any; queryConfigs?: any } = {},
  ): MatDialogRef<FsAttributeEditComponent> {
    return this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: new AttributeItem({ 
          class: this.attributeConfig.class, 
        }, this.attributeConfig),
        attributeConfig: this.attributeConfig,
        data: config.data,
        mode: 'create',
        queryConfigs: config.queryConfigs,
      },
      panelClass: [
        'fs-attribute-dialog',
        'fs-attribute-dialog-no-scroll',
        `fs-attribute-${this.attributeConfig.class}`,
      ],
    });
  }
}
