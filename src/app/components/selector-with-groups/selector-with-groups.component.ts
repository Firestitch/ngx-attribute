import {
  Component,
  EventEmitter, HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { clone, filter, map } from 'lodash-es';

import { FsAttributeEditComponent } from '../attribute-edit';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';


@Component({
  selector: 'fs-attribute-selector-with-groups',
  templateUrl: './selector-with-groups.component.html',
  styleUrls: [ './selector-with-groups.component.scss' ]
})
export class FsAttributeSelectorWithGroupsComponent implements OnInit, OnDestroy {

  @Input()
  public data = {};

  @Input()
  public showCreate = true;

  @Input('class')
  public klass: string;

  @Input()
  public selectedAttributes = [];

  @Input()
  public placeholder = 'Search';

  @Output()
  public selectedToggled = new EventEmitter();

  @HostBinding('class') hostClass = '';

  public childClass: string;
  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem = null;
  public dialogMode = false;
  public compareFn: (o1: any, o2: any) => boolean;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: any,
    @Optional() private dialogRef: MatDialogRef<FsAttributeSelectorWithGroupsComponent>,
  ) {}

  public ngOnInit() {
    if (this.dialogData && this.dialogData.class) {
      this.dialogMode = !!this.dialogData;
      this.klass = this.dialogData.class;
      this.childClass = this.dialogData.childClass;
      this.data = this.dialogData.data;

      this.selectedAttributes = this.dialogData.selectedAttributes;
      this.showCreate = this.dialogData.showCreate;

      this.initDialog();
    } else {
      this.hostClass = 'fs-attribute fs-attribute-' + this.klass;
      Object.assign(this.data, { childAttributes: true });
    }

    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    this.compareFn = this.getCompareFn();

    this.fetch();
  }

  public getCompareFn() {
    if (this.dialogData && this.dialogData.class) {
      return this.attributesConfig.compareAttributes.bind(this.attributesConfig);
    } else {
      return this.attributesConfig.compare.bind(this.attributesConfig);
    }
  };

  public selectedToggle(event) {

    this.selectedToggled.emit({
      selected: event.selected,
      value: event.value.toJSON(),
    });

    event.data = this.data;
    event.klass = this.childClass;
    event.attribute = event.value;

    this.attributesConfig.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: any) => {
      });
  }

  public done() {
    this.dialogRef.close({ attributes: this.selectedAttributes });
  }

  public create() {
    const attribute = new AttributeItem(
      { class: this.attributeConfig.childClass },
      this.attributesConfig,
    );

    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        klass: this.attributeConfig.childClass,
        selectParent: this.attributeConfig.klass,
        mode: 'create',
      },
      panelClass: [
        `fs-attribute-dialog`,
        `fs-attribute-dialog-no-scroll`,
        `fs-attribute-${this.attributeConfig.childClass}`
      ],
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(response => {
      this.fetch();
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initDialog() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick()
      .pipe(takeUntil(this._destroy$))
      .subscribe(result => {
        this.done();
      });
  }

  private fetch(keyword = null) {
    const e = {
      query: {},
      keyword: keyword,
      class: this.klass,
      data: this.data,
    };

    this.attributesConfig.getAttributes(e)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.attributes = response.data;
      });
  }

  public search(text) {
    this.fetch(text);
  }
}
