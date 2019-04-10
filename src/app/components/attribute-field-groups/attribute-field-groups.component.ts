import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';

import { FsAttributeTreeSelectorComponent } from './selector/selector.component';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';


@Component({
  selector: 'fs-attribute-field-groups',
  templateUrl: './attribute-field-groups.component.html',
  styleUrls: [ './attribute-field-groups.component.scss' ],
})
export class FsAttributeFieldGroupsComponent implements OnInit, OnDestroy {

  public title: string;
  public attributes: AttributeItem[] = [];
  public selectedAttributes: AttributeItem[] = [];

  public attributeConfig: AttributeConfigItem;
  private destroy$ = new Subject();

  @Input() data;
  @Input() set heading(value) {
    this.title = value;
  }
  @Input('class') klass: string;
  @Input() public mode;
  @Output() changed = new EventEmitter<AttributeItem[]>();

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

      this.selectedAttributes = this.attributes.reduce((acc, attribute) => {
        acc.push(...attribute.children);

        return acc;
      }, []);
    });

    this.changed
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((attributes) => {
        this.selectedAttributes = attributes;
      });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public select() {

    const dialogRef = this.dialog.open(FsAttributeTreeSelectorComponent, {
      data: {
        selectedAttributes: this.selectedAttributes.slice(),
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

}
