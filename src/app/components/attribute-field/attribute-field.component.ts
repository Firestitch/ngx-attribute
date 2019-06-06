import {
  Component,
  Input,
  OnInit,
  Inject,
  OnDestroy,
  Output,
  EventEmitter,
  ContentChild, TemplateRef
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeItem } from '../../models/attribute';
import { FsAttributeTemplateDirective } from '../../directives/attribute-template.component';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: [ './attribute-field.component.scss' ],
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
    this.title = value;
  }

  @Input('class')
  public klass: string;

  @Output()
  public changed = new EventEmitter<AttributeItem[]>();

  @ContentChild(FsAttributeTemplateDirective, { read: TemplateRef })
  public templ: TemplateRef<FsAttributeTemplateDirective>;

  public title: string | boolean;
  public attributes: AttributeItem[] = [];
  public attributeConfig: any = {};
  private destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
    @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    if (this.title === void 0 && this.attributeConfig.child) {
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
        data: this.data,
        showCreate: this.showCreate
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        if (response && response.attributes) {

          this.attributes = this.attributesConfig.sortAttributes(this.klass, response.attributes)
          this.changed.emit(this.attributes);
        }
      });
  }

}
