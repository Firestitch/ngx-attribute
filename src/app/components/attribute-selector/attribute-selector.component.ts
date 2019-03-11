import { Component, Inject, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig, AttributeConfig } from '../../interfaces/attribute-config.interface';
import { FsAttributeManageComponent } from '../attribute-manage/attribute-manage.component';
import { filter, clone, map } from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { getAttributeValue, wrapAttributes } from '../../helpers/helpers';


@Component({
  templateUrl: 'attribute-selector.component.html',
  styleUrls: [ 'attribute-selector.component.scss' ]
})
export class FsAttributeSelectorComponent implements OnInit, OnDestroy {

  public selectedAttributes = [];
  public attributes = [];
  public attributeConfig: AttributeConfig = null;
  private $destroy = new Subject();
  @Output() selectedToggled = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
              private dialogRef: MatDialogRef<FsAttributeSelectorComponent>,
              private dialog: MatDialog) {
    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.data.class })[0] || {};
    this.selectedAttributes =  wrapAttributes(fsAttributeConfig, clone(this.data.selectedAttributes));
  }

  public compare = (o1, o2) => {
    return this.fsAttributeConfig.compareAttributes(o1, o2);
  }

  ngOnInit() {


    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(result => {
      this.done();
    });

    this.fetch();

    this.selectedToggled
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe((e: any) => {
      e.data = this.data.data;
      e.class = this.data.class;
      e.attribute = e.value;

      this.fsAttributeConfig.attributeSelectionChanged(e)
      .pipe(
        takeUntil(this.$destroy)
      )
      .subscribe((e: any) => {});
    });
  }

  private fetch() {
    const e = { query: {},
                class: this.data.class,
                data: this.data.data };

    this.fsAttributeConfig.getAttributes(e)
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe(response => {
      this.attributes = wrapAttributes(this.fsAttributeConfig, response.data);
    });
  }

  done() {
    const attributes = map(this.selectedAttributes, 'attribute');
    this.dialogRef.close({ attributes: attributes });
  }

  create() {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attibute: {},
        class: this.data.class,
        config: this.data.config,
        data: this.data.data
      }
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe(response => {
      this.fetch();
    });
  }

  manage() {
    const dialogRef = this.dialog.open(FsAttributeManageComponent, {
      data: {
        class: this.data.class
      }
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.$destroy)
    )
    .subscribe(response => {
      this.fetch();
    });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
