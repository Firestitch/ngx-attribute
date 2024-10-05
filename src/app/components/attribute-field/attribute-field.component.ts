import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsAttributeTemplateDirective } from '../../directives/attribute-template.component';
import { AttributeConfig, FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { AttributeItem } from '../../models/attribute';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { AttributesConfig } from '../../services/attributes-config';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: [ './attribute-field.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeFieldComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input()
  public showCreate = true;

  @Input()
  public showSelect = true;

  @Input()
  set heading(value) {
    this.label = value;
  }

  @Input('class')
  public klass: string;

  @Input()
  public label: string | boolean;

  @Input()
  public size: 'small' | 'tiny';

  @Input()
  public queryConfigs: any;

  @Output()
  public changed = new EventEmitter<AttributeItem[]>();

  @ContentChild(FsAttributeTemplateDirective, { read: TemplateRef })
  public templ: TemplateRef<FsAttributeTemplateDirective>;

  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfig;
  private destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
    @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);
    if (this.label === void 0) {
      this.label = this.attributeConfig.pluralName;
    }

    this.fetch();
  }

  public ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  public fetch() {
    const e = {
      data: this.data,
      class: this.klass,
      queryConfigs: this.queryConfigs,
    };

    this.attributesConfig.getSelectedAttributes(e)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        this.attributes = response.data;

        this._cdRef.markForCheck();
      });
  }

  public select() {
   this.dialog.open(FsAttributeSelectorComponent, {
      data: {
        selectedAttributes: this.attributes.slice(),
        class: this.klass,
        data: this.data,
        size: this.size,
        showCreate: this.showCreate,
        queryConfigs: this.queryConfigs,
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
    })
    .afterClosed()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        if (response && response.attributes) {

          this.attributes = this.attributesConfig.sortAttributes(this.klass, response.attributes);
          this.changed.emit(this.attributes);

          this._cdRef.markForCheck();
        }
      });
  }

}
