import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';
import { scrollIntoView } from '../../helpers/scroll-into-view';


@Component({
  selector: 'fs-attribute-selector',
  templateUrl: './attribute-selector.component.html',
  styleUrls: [ './attribute-selector.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeSelectorComponent implements OnInit, OnDestroy {

  @Input()
  public data = {};

  @Input()
  public showCreate = true;

  @Input('class')
  public klass: string;

  @Input()
  public placeholder: string;

  @Input()
  public filter = false;

  @Input()
  public selectedAttributes = [];

  @Input()
  public queryConfigs: any;

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
    private el: ElementRef,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: any,
    @Optional()private dialogRef: MatDialogRef<FsAttributeSelectorComponent>,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    if (this.dialogData && this.dialogData.class) {
      this.dialogMode = !!this.dialogData;
      this.klass = this.dialogData.class;
      this.data = this.dialogData.data;

      this.selectedAttributes = this.dialogData.selectedAttributes;
      this.showCreate = this.dialogData.showCreate;

      this.initDialog();
    } else {
      this.hostClass = 'fs-attribute fs-attribute-' + this.klass;
    }

    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    this.fetch();
    this.compareFn = this.getCompareFn();

    scrollIntoView(this.el);
  }

  public getCompareFn() {
    if (this.dialogData && this.dialogData.class) {
      return this.attributesConfig.compareAttributes.bind(this.attributesConfig);
    } else {
      return this.attributesConfig.compare.bind(this.attributesConfig);
    }
  };

  public done() {
    this.dialogRef.close({ attributes: this.selectedAttributes });
  }

  public create() {
    const attribute = new AttributeItem(
      { class: this.attributeConfig.klass },
      this.attributesConfig
    );

    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        klass: this.attributeConfig.klass,
        config: this.dialogData && this.dialogData.config,
        data: this.data,
        mode: 'create',
        query_configs: this.dialogData?.query_configs || this.queryConfigs,
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.attributeConfig.klass}`],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        this.fetch(response?.attribute.id);
      });
  }


  public selectedToggle(event) {
    this.selectedToggled.emit({
      selected: event.selected,
      value: event.value.toJSON(),
    });

    event.data = this.data;
    event.klass = this.klass;
    event.attribute = event.value;

    this.attributesConfig.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((e: any) => {});
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public filterByKeyword() {
    if (this.filterKeyword === '') {
      this.filteredAttributes = this.attributes.slice();
    } else {
      this.filteredAttributes = this.attributes.filter((attribute) => {
        const name = attribute.name.toString().toLowerCase();

        return name.indexOf(this.filterKeyword.toLowerCase()) > -1;
      })
    }
  }

  /**
   * @param autoSelectId - param which can be passed for automatically select some attr after fetch
   */
  private fetch(autoSelectId: number = null) {
    const e = {
      query: {},
      class: this.klass,
      data: this.data,
      query_configs: this.dialogData?.query_configs || this.queryConfigs
    };

    this.attributesConfig.getAttributes(e)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.attributes = response.data;
        this.filteredAttributes = this.attributes.slice();

        if (autoSelectId) {
          const attribute = this.attributes
            .find((attr) => attr.id === autoSelectId);

          // Add to selected attributes
          this.selectedAttributes.push(attribute);

          // selectedToggle method required special event object
          const event = {
            selected: true,
            value: attribute
          }
          this.selectedToggle(event);
        }

        this.cdRef.markForCheck();
      });
  }

  private initDialog() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(result => {
      this.done();
    });
  }
}
