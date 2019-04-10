import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { FsAttributeTreeSelectorComponent } from './selector/selector.component';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';


@Component({
  selector: 'fs-attribute-field-groups',
  templateUrl: './attribute-field-groups.component.html',
  styleUrls: [ '../attribute-field/attribute-field.component.scss' ],
})
export class FsAttributeFieldGroupsComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input('class')
  public klass: string;

  @Input()
  public mode;

  @Input()
  set heading(value) {
    this.title = value;
  }

  @Output()
  public changed = new EventEmitter<AttributeItem[]>();

  public title: string | boolean;
  public attributes: AttributeItem[] = [];
  public selectedAttributes: AttributeItem[] = [];

  public attributeConfig: AttributeConfigItem;
  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    if (this.title === void 0 && this.attributeConfig.child) {
      this.title = this.attributeConfig.child.pluralName
    }

    const e = {
      data: this.data,
      class: this.klass
    };

    this.attributesConfig.getSelectedAttributes(e)
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe((response) => {
      this.attributes = response.data;

      this.selectedAttributes = this.attributes.reduce((acc, attribute) => {
        acc.push(...attribute.children);

        return acc;
      }, []);
    });

    this.changed
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((attributes) => {
        this.selectedAttributes = attributes;
      });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public select() {

    const dialogRef = this.dialog.open(FsAttributeTreeSelectorComponent, {
      data: {
        selectedAttributes: this.selectedAttributes.slice(),
        class: this.klass,
        data: this.data,
      },
      panelClass: `fs-attribute-${this.klass}`,
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {
        if (response && response.attributes) {
          this.changed.emit(response.attributes);
        }
      });
  }

}
