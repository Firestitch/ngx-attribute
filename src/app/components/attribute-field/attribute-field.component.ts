import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, inject } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { FsLabelModule } from '@firestitch/label';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsAttributeTemplateDirective } from '../../directives/attribute-template.component';
import { AttributeModel } from '../../models/attribute';
import { AttributeConfigModel } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { FsAttributeComponent } from '../attribute/attribute.component';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: ['./attribute-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsLabelModule,
    NgTemplateOutlet,
    FsAttributeComponent,
    MatIconButton,
    MatIcon,
  ],
})
export class FsAttributeFieldComponent implements OnInit, OnDestroy {

  public attributeService = inject(AttributeService);

  @Input()
  public data;

  @Input()
  public showCreate = true;

  @Input()
  public showSelect = true;

  @Input()
  public showManage = true;

  @Input()
  public padless = false;

  @Input()
  public set heading(value) {
    this.label = value;
  }

  @Input('class')
  public class: string;

  @Input()
  public label: string | boolean;

  @Input()
  public size: 'small' | 'tiny';

  @Output()
  public changed = new EventEmitter<AttributeModel[]>();

  @ContentChild(FsAttributeTemplateDirective, { read: TemplateRef })
  public templ: TemplateRef<FsAttributeTemplateDirective>;

  public attributes: AttributeModel[] = [];
  public attributeConfig: AttributeConfigModel;

  private _destroy$ = new Subject<void>();
  private _dialog = inject(MatDialog);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit() {
    this.attributeConfig = this.attributeService.getConfig(this.class);
    if (this.label === undefined) {
      this.label = this.attributeConfig.pluralName;
    }

    this.fetch();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public fetch() {
    const e = {
      data: this.data,
      class: this.class,
    };

    this.attributeService.getSelectedAttributes(e)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;

        this._cdRef.markForCheck();
      });
  }

  public select() {
    this._dialog
      .open(FsAttributeSelectorComponent, {
        data: {

        },
        panelClass: ['fs-attribute-dialog', 'fs-attribute-dialog-no-scroll', `fs-attribute-${this.class}`],
      })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response && response.attributes) {

          this.attributes = this.attributeService.sortAttributes(this.class, response.attributes);
          this.changed.emit(this.attributes);

          this._cdRef.markForCheck();
        }
      });
  }

}
