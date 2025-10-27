import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AttributeModel } from '../../models/attribute';
import { AttributeConfigModel } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeEditComponent } from '../attribute-edit/attribute-edit.component';
import { FsAttributeManageComponent } from '../attribute-manage';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FsChipModule } from '@firestitch/chip';


@Component({
    selector: 'fs-attribute-selector',
    templateUrl: './attribute-selector.component.html',
    styleUrls: ['./attribute-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsDialogModule,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        NgTemplateOutlet,
        MatDialogActions,
        MatButton,
        FsFormModule,
        MatFormField,
        MatLabel,
        MatIcon,
        MatPrefix,
        MatInput,
        FormsModule,
        FsChipModule,
    ],
})
export class FsAttributeSelectorComponent implements OnInit, OnDestroy {

  @Input()
  public data = {};

  @Input()
  public showManage = true;

  @Input('class')
  public class: string;

  @Input()
  public placeholder: string;

  @Input()
  public filter = false;

  @Input()
  public selectedAttributes = [];

  @Input()
  public size: 'small' | 'tiny';

  @Output()
  public selectedToggled = new EventEmitter();

  @HostBinding('class') public hostClass = '';

  public attributes: AttributeModel[] = [];
  public filteredAttributes: AttributeModel[] = [];
  public attributeConfig: AttributeConfigModel = null;
  public dialogMode = false;

  public filterKeyword = '';

  public compareFn: (o1: any, o2: any) => boolean;

  private _destroy$ = new Subject();

  constructor(
    public attributeService: AttributeService,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: any,
    @Optional()private _dialogRef: MatDialogRef<FsAttributeSelectorComponent>,
  ) {}

  public ngOnInit() {
    if (this.dialogData && this.dialogData.class) {
      this.dialogMode = !!this.dialogData;
      this.class = this.dialogData.class;
      this.data = this.dialogData.data;
      this.size = this.dialogData.size;
      this.showManage = this.dialogData.showManage ?? true;
      this.selectedAttributes = this.dialogData.selectedAttributes;
      this._initDialog();
    } else {
      this.hostClass = `fs-attribute fs-attribute-${  this.class}`;
    }

    this.attributeConfig = this.attributeService.getConfig(this.class);

    this._fetch();
    this.compareFn = this.getCompareFn();
  }

  public getCompareFn() {
    if (this.dialogData && this.dialogData.class) {
      return this.attributeService.compareAttributes.bind(this.attributeService);
    }
 
    return this.attributeService.compare.bind(this.attributeService);
    
  }

  public done() {
    this._dialogRef.close({ attributes: this.selectedAttributes });
  }

  public create() {
    const attribute = new AttributeModel(
      { class: this.attributeConfig.class },
      this.attributeService.getConfig(this.attributeConfig.class),
    );

    const dialogRef = this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        attributeConfig: this.attributeConfig,
        config: this.dialogData && this.dialogData.config,
        data: this.data,
        mode: 'create',
      },
      panelClass: [
        'fs-attribute-dialog',
        'fs-attribute-dialog-no-scroll',
        `fs-attribute-${this.attributeConfig.class}`,
      ],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._fetch(response?.attribute.id);
      });
  }

  public manage() {
    this._dialog.open(FsAttributeManageComponent, {
      disableClose: true,
      data: {
        attributeConfig: this.attributeConfig,
        size: this.size,
      },
      autoFocus: false,
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._fetch(response?.attribute.id);
      });
  }

  public selectedToggle(event) {
    this.selectedToggled.emit({
      selected: event.selected,
      value: event.value.toJSON(),
    });

    event.data = this.data;
    event.class = this.class;
    event.attribute = event.value;

    this.attributeService.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public filterByKeyword() {
    this.filteredAttributes = this.filterKeyword === '' ? this.attributes.slice() : this.attributes.filter((attribute) => {
      const name = attribute.name.toString().toLowerCase();

      return name.indexOf(this.filterKeyword.toLowerCase()) > -1;
    });
  }

  private _fetch(attributeId: number = null) {
    const e = {
      query: {},
      class: this.class,
      data: this.data,
    };

    this.attributeService.getAttributes(e, this.attributeConfig)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;
        this.filteredAttributes = this.attributes.slice();

        this.selectedAttributes = this.selectedAttributes
          .map((selectedAttribute) => {
            const newAttribute = this.attributes
              .find((attr) => attr.id === selectedAttribute.id);

            return newAttribute ?? selectedAttribute;
          });

        if (attributeId) {
          const attribute = this.attributes
            .find((attr) => attr.id === attributeId);

          // Add to selected attributes
          this.selectedAttributes.push(attribute);

          // selectedToggle method required special event object
          const event = {
            selected: true,
            value: attribute,
          };
          this.selectedToggle(event);
        }

        this._cdRef.markForCheck();
      });
  }

  private _initDialog() {
    this._dialogRef.disableClose = true;
    this._dialogRef.backdropClick().subscribe(() => {
      this.done();
    });
  }

}
