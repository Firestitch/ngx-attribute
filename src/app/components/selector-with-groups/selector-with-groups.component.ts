import {
  ChangeDetectionStrategy, ChangeDetectorRef,
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

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeEditComponent } from '../attribute-edit';


@Component({
  selector: 'fs-attribute-selector-with-groups',
  templateUrl: './selector-with-groups.component.html',
  styleUrls: ['./selector-with-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeSelectorWithGroupsComponent implements OnInit, OnDestroy {

  @Input()
  public data = {};

  @Input()
  public showCreate = true;

  @Input('class')
  public class: string;

  @Input()
  public selectedAttributes = [];

  @Input()
  public placeholder = 'Search';

  @Output()
  public selectedToggled = new EventEmitter();

  @HostBinding('class') public hostClass = '';

  public childClass: string;
  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem = null;
  public dialogMode = false;
  public compareFn: (o1: any, o2: any) => boolean;

  private _destroy$ = new Subject();

  constructor(
    public attributeService: AttributeService,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: any,
    @Optional() private _dialogRef: MatDialogRef<FsAttributeSelectorWithGroupsComponent>,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    if (this.dialogData && this.dialogData.class) {
      this.dialogMode = !!this.dialogData;
      this.class = this.dialogData.class;
      this.childClass = this.dialogData.childClass;
      this.data = this.dialogData.data;
      this.selectedAttributes = this.dialogData.selectedAttributes;
      this.showCreate = this.dialogData.showCreate;

      this._initDialog();
    } else {
      this.hostClass = `fs-attribute fs-attribute-${this.class}`;
      Object.assign(this.data, { childAttributes: true });
    }

    this.attributeConfig = this.attributeService.getConfig(this.class);

    this.compareFn = this.getCompareFn();

    this._fetch();
  }

  public getCompareFn() {
    if (this.dialogData && this.dialogData.class) {
      return this.attributeService.compareAttributes.bind(this.attributeService);
    }
 
    return this.attributeService.compare.bind(this.attributeService);
    
  }

  public selectedToggle(event) {

    this.selectedToggled.emit({
      selected: event.selected,
      value: event.value.toJSON(),
    });

    event.data = this.data;
    event.class = this.childClass;
    event.attribute = event.value;

    this.attributeService.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public done() {
    this._dialogRef.close({ attributes: this.selectedAttributes });
  }

  public create() {
    const attribute = new AttributeItem(
      { class: this.attributeConfig.childClass },
      this.attributeService.getConfig(this.attributeConfig.childClass),
    );

    const dialogRef = this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        attributeConfig: this.attributeConfig,
        mode: 'create',
      },
      panelClass: [
        'fs-attribute-dialog',
        'fs-attribute-dialog-no-scroll',
        `fs-attribute-${this.attributeConfig.childClass}`,
      ],
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._fetch(
          null,
          {
            parentId: response?.parent.id,
            attrId: response?.attribute.id,
          });
      });
  }

  public search(text) {
    this._fetch(text);
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _initDialog() {
    this._dialogRef.disableClose = true;
    this._dialogRef.backdropClick()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.done();
      });
  }

  /**
   *
   * @param keyword
   * @param autoSelectAttr - param which can be passed for automatically select some attr after fetch
   */
  private _fetch(keyword = null, autoSelectAttr = null) {
    const e = {
      query: {},
      keyword: keyword,
      class: this.class,
      data: this.data,
    };

    this.attributeService.getAttributes(e, this.attributeConfig)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;

        // We should auto select attribute after it was created
        if (autoSelectAttr) {
          const group = this.attributes
            .find((attr) => attr.id === autoSelectAttr.parentId);

          if (group) {
            const attribute = group.children.find((attr) => attr.id === autoSelectAttr.attrId);

            // Add to selected attributes
            this.selectedAttributes.push(attribute);

            // selectedToggle method required special event object
            const event = {
              selected: true,
              value: attribute,
            };
            this.selectedToggle(event);
          }
        }

        this._cdRef.markForCheck();
      });
  }
}
