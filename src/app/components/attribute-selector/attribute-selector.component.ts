import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { FsAttributeManageComponent } from '../attribute-manage';


@Component({
  selector: 'fs-attribute-selector',
  templateUrl: './attribute-selector.component.html',
  styleUrls: ['./attribute-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeSelectorComponent implements OnInit, OnDestroy {

  @Input()
  public data = {};

  @Input()
  public showManage = true;

  @Input('class')
  public class: string;

  @Input()
  public placeholder: string;

  @Input()
  public filter = false;

  @Input()
  public selectedAttributes = [];

  @Input()
  public queryConfigs: any;

  @Input()
  public size: 'small' | 'tiny';

  @Output()
  public selectedToggled = new EventEmitter();

  @HostBinding('class') hostClass = '';

  public attributes: AttributeItem[] = [];
  public filteredAttributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem = null;
  public dialogMode = false;

  public filterKeyword = '';

  public compareFn: (o1: any, o2: any) => boolean;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: any,
    @Optional()private _dialogRef: MatDialogRef<FsAttributeSelectorComponent>,
  ) {}

  public ngOnInit() {
    if (this.dialogData && this.dialogData.class) {
      this.dialogMode = !!this.dialogData;
      this.class = this.dialogData.class;
      this.data = this.dialogData.data;
      this.size = this.dialogData.size;

      this.selectedAttributes = this.dialogData.selectedAttributes;

      this._initDialog();
    } else {
      this.hostClass = `fs-attribute fs-attribute-${  this.class}`;
    }

    this.attributeConfig = this.attributesConfig.getConfig(this.class);

    this._fetch();
    this.compareFn = this.getCompareFn();
  }

  public getCompareFn() {
    if (this.dialogData && this.dialogData.class) {
      return this.attributesConfig.compareAttributes.bind(this.attributesConfig);
    }
 
    return this.attributesConfig.compare.bind(this.attributesConfig);
    
  }

  public done() {
    this._dialogRef.close({ attributes: this.selectedAttributes });
  }

  public create() {
    const attribute = new AttributeItem(
      { class: this.attributeConfig.class },
      this.attributesConfig.getConfig(this.attributeConfig.class),
    );

    const dialogRef = this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        attributeConfig: this.attributeConfig,
        config: this.dialogData && this.dialogData.config,
        data: this.data,
        mode: 'create',
        queryConfigs: this.dialogData?.queryConfigs || this.queryConfigs,
      },
      panelClass: [
        'fs-attribute-dialog',
        'fs-attribute-dialog-no-scroll',
        `fs-attribute-${this.attributeConfig.class}`,
      ],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._fetch(response?.attribute.id);
      });
  }

  public manage() {
    this._dialog.open(FsAttributeManageComponent, {
      disableClose: true,
      data: {
        class: this.attributeConfig.class,
        pluralName: this.attributeConfig.pluralName,
        data: this.data,
        size: this.size,
        queryConfigs: this.dialogData?.queryConfigs || this.queryConfigs,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._fetch(response?.attribute.id);
      });
  }

  public selectedToggle(event) {
    this.selectedToggled.emit({
      selected: event.selected,
      value: event.value.toJSON(),
    });

    event.data = this.data;
    event.class = this.class;
    event.attribute = event.value;

    this.attributesConfig.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public filterByKeyword() {
    this.filteredAttributes = this.filterKeyword === '' ? this.attributes.slice() : this.attributes.filter((attribute) => {
      const name = attribute.name.toString().toLowerCase();

      return name.indexOf(this.filterKeyword.toLowerCase()) > -1;
    });
  }

  private _fetch(attributeId: number = null) {
    const e = {
      query: {},
      class: this.class,
      data: this.data,
      queryConfigs: this.dialogData?.queryConfigs || this.queryConfigs,
    };

    this.attributesConfig.getAttributes(e, this.attributeConfig)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;
        this.filteredAttributes = this.attributes.slice();

        this.selectedAttributes = this.selectedAttributes
          .map((selectedAttribute) => {
            const newAttribute = this.attributes
              .find((attr) => attr.id === selectedAttribute.id);

            return newAttribute ?? selectedAttribute;
          });

        if (attributeId) {
          const attribute = this.attributes
            .find((attr) => attr.id === attributeId);

          // Add to selected attributes
          this.selectedAttributes.push(attribute);

          // selectedToggle method required special event object
          const event = {
            selected: true,
            value: attribute,
          };
          this.selectedToggle(event);
        }

        this._cdRef.markForCheck();
      });
  }

  private _initDialog() {
    this._dialogRef.disableClose = true;
    this._dialogRef.backdropClick().subscribe(() => {
      this.done();
    });
  }

}
