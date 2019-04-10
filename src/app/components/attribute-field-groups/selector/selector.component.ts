import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { clone, filter, map } from 'lodash-es';

import { FsAttributeEditComponent } from '../../attribute-edit/attribute-edit.component';
import { FsAttributeManageComponent } from '../../attribute-manage/attribute-manage.component';
import { AttributeConfigItem } from '../../../models/attribute-config';
import { AttributesConfig } from '../../../services/attributes-config';
import { AttributeItem } from '../../../models/attribute';


@Component({
  templateUrl: './selector.component.html',
  styleUrls: [ './selector.component.scss' ]
})
export class FsAttributeTreeSelectorComponent implements OnInit, OnDestroy {

  @Output()
  public selectedToggled = new EventEmitter();

  public selectedAttributes = [];
  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem = null;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FsAttributeTreeSelectorComponent>,
    private dialog: MatDialog
  ) {
    this.attributeConfig = this.attributesConfig.configs.get(this.data.class);
    this.selectedAttributes = this.data.selectedAttributes;
  }

  public ngOnInit() {
    this.initDialog();
    this.fetch();
  }

  public selectedToggle(event) {
    this.selectedToggled.emit(event);

    event.data = this.data.data;
    event.klass = this.data.class;
    event.attribute = event.value;

    this.attributesConfig.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((e: any) => {});
  }

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
        klass: this.attributeConfig.childClass,
        selectParent: this.attributeConfig.klass,
      },
      panelClass: `fs-attribute-${this.attributeConfig.childClass}`,
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(response => {
      this.fetch();
    });
  }

  public compare = (o1, o2) => {
    return this.attributesConfig.compareAttributes(o1, o2);
  };

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
      class: this.data.class,
      data: this.data.data
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
