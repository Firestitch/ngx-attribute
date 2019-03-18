import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: [ './attribute-field.component.scss' ],
})
export class FsAttributeFieldComponent implements OnInit, OnDestroy {

  public attributes: any = [];
  public attributeConfig: any = {};
  private destroy$ = new Subject();

  @Input() data;
  @Input('class') klass: string;
  @Output() changed = new EventEmitter();

  constructor(private dialog: MatDialog,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {}

  public select() {
    const dialogRef = this.dialog.open(FsAttributeSelectorComponent, {
      data: {
        selectedAttributes: this.attributes,
        class: this.klass,
        data: this.data
      }
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(response => {
      if (response && response.attributes) {
        this.changed.emit(response.attributes);
      }
    });
  }

  ngOnInit() {

    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.klass })[0] || {};

    const e = {
      data: this.data,
      class: this.klass
    };

    this.fsAttributeConfig.getSelectedAttributes(e)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((response) => {
      this.attributes = response.data;
    });

    this.changed
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((attributes) => {
      this.attributes = attributes;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
