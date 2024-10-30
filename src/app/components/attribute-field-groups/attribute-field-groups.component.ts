import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { FsAttributeSelectorWithGroupsComponent } from '../selector-with-groups/selector-with-groups.component';


@Component({
  selector: 'fs-attribute-field-groups',
  templateUrl: './attribute-field-groups.component.html',
  styleUrls: ['../attribute-field/attribute-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeFieldGroupsComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input()
  public showCreate = true;

  @Input('class')
  public class: string;

  @Input()
  public queryConfigs: any;

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
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.class);

    if (this.title === void 0 && this.attributeConfig.child) {
      this.title = this.attributeConfig.child.pluralName;
    }

    const e = {
      data: this.data,
      parentClass: this.class,
      class: this.attributeConfig.childClass,
      queryConfigs: this.queryConfigs,
    };

    this.attributesConfig.getSelectedAttributes(e)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;

        this.selectedAttributes = this.attributes.reduce((acc, attribute) => {
          acc.push(attribute);

          return acc;
        }, []);

        this.cdRef.markForCheck();
      });

    this.changed
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((attributes) => {
        this.selectedAttributes = attributes;

        this.cdRef.markForCheck();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public select() {

    const dialogRef = this.dialog.open(FsAttributeSelectorWithGroupsComponent, {
      data: {
        selectedAttributes: this.selectedAttributes.slice(),
        class: this.class,
        childClass: this.attributeConfig.childClass,
        data: this.data,
        showCreate: this.showCreate,
        queryConfigs: this.queryConfigs,
      },
      panelClass: ['fs-attribute-dialog', `fs-attribute-${this.class}`],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response && response.attributes) {

          const parentAttributeConfig = this.attributesConfig.getAttributeConfig(this.class);

          const attributes = this.attributesConfig.sortAttributes(parentAttributeConfig.childClass, response.attributes);

          this.changed.emit(attributes);

          this.cdRef.markForCheck();
        }
      });
  }

}
