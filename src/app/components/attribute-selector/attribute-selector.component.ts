import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { clone, filter, map } from 'lodash-es';

import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';


@Component({
  templateUrl: './attribute-selector.component.html',
  styleUrls: [ './attribute-selector.component.scss' ]
})
export class FsAttributeSelectorComponent implements OnInit, OnDestroy {

  @Output()
  public selectedToggled = new EventEmitter();

  public showCreate = true;
  public selectedAttributes = [];
  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem = null;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FsAttributeSelectorComponent>,
    private dialog: MatDialog
  ) {
    this.attributeConfig = this.attributesConfig.getConfig(this.data.class);
    this.selectedAttributes = this.data.selectedAttributes;
    this.showCreate = this.data.showCreate;

  }

  public ngOnInit() {
    this.fetch();
    this.initDialog();
  }

  public compare = (o1, o2) => {
    return this.attributesConfig.compareAttributes(o1, o2);
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
        config: this.data.config,
        data: this.data.data
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-${this.attributeConfig.klass}`],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        this.fetch();
      });
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

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private fetch() {
    const e = {
      query: {},
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

  private initDialog() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(result => {
      this.done();
    });
  }
}
