import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: [ './attribute-field.component.scss' ],
})
export class FsAttributeFieldComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input()
  set heading(value) {
    this.title = value;
  }

  @Input('class')
  public klass: string;

  @Output()
  public changed = new EventEmitter<AttributeItem[]>();

  public title: string;
  public attributes: AttributeItem[] = [];
  public attributeConfig: any = {};
  private destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
    @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.configs.get(this.klass);

    if (!this.title && this.attributeConfig.child) {
      this.title = this.attributeConfig.child.pluralName
    }

    this.fetch();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public fetch() {
    const e = {
      data: this.data,
      class: this.klass
    };

    this.attributesConfig.getSelectedAttributes(e)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.attributes = response.data;
      });
  }

  public select() {
    const dialogRef = this.dialog.open(FsAttributeSelectorComponent, {
      data: {
        selectedAttributes: this.attributes.slice(),
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
          this.attributes = response.attributes;
          this.changed.emit(this.attributes);
        }
      });
  }

}
