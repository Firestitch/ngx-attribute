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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig, ReorderPosition, ReorderStrategy } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { Observable, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { AttributeOrder } from '../../enums/enums';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';

import { FsAttributeListColumnDirective } from '../../directives/list-column.directive';
import { FsAttributeListAction } from '../../interfaces/list-action.interface';
import { FsAttributeService } from '../../services/attribute-service';


@Component({
  selector: 'fs-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: [ './attribute-list.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeListComponent implements OnInit, OnDestroy {

  @ViewChild('list', { static: true })
  public list: FsListComponent;

  @ContentChild(FsAttributeListColumnDirective, { read: TemplateRef })
  public columnTemplate: TemplateRef<any>;

  @Input('class')
  public klass: string;

  @Input()
  public actions: FsAttributeListAction[] = [];

  @Input()
  public data: any;

  @Input()
  public size: 'small' | 'tiny';

  @Input()
  public queryConfigs: any;

  @Input() public queryParam: boolean = null;

  public listConfig: FsListConfig;
  // public listItems
  public attributeConfig: AttributeConfigItem = null;

  private _destroy$ = new Subject();

  constructor(
    public attributeService: FsAttributeService,
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public dialogData: any,
  ) { }

  public ngOnInit() {
    this.klass = this.dialogData?.klass || this.klass;
    this.data = this.dialogData?.data || this.data;
    this.queryConfigs = this.dialogData?.queryConfigs || this.queryConfigs;
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
        queryConfigs: this.queryConfigs,
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
    });

    dialogRef.afterClosed()
      .pipe(
        filter((response) => !!response),
      )
      .subscribe((response) => {
        const attr = new AttributeItem(response.attribute, attribute.attributesConfig);
        this.list.replaceRow(attr, (listRow) => listRow.id === attribute.id);

        this.cdRef.markForCheck();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setListConfig() {
    const config: FsListConfig = {
      paging: {
        limits: [ 50, 100, 200, 500, 1000 ]
      },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      actions: [
        ...this.actions,
        {
          label: 'Create',
          click: () => this._createActionClick()
        }
      ],
      rowActions: [
        {
          click: (row, event) => {
            return this._deleteRow(row);
          },
          remove: true,
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
          class: this.klass,
          queryConfigs: this.queryConfigs,
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
            class: this.klass,
            queryConfigs: this.queryConfigs,
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

    if (this.queryParam !== null) {
      config.queryParam = this.queryParam;
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

  private _createActionClick() {
    const dialogRef = this.attributeService.createAttribute(this.klass, {
      data: this.data,
      queryConfigs: this.queryConfigs,
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.list.reload();
      });
  }
}
