import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { FsAttributeEditComponent } from '../attribute-edit';


@Component({
  selector: 'fs-attribute-selector-with-groups',
  templateUrl: './selector-with-groups.component.html',
  styleUrls: [ './selector-with-groups.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeSelectorWithGroupsComponent implements OnInit, OnDestroy {

  @Input()
  public data = {};

  @Input()
  public showCreate = true;

  @Input('class')
  public klass: string;

  @Input()
  public selectedAttributes = [];

  @Input()
  public placeholder = 'Search';

  @Input()
  public queryConfigs: any;

  @Output()
  public selectedToggled = new EventEmitter();

  @HostBinding('class') hostClass = '';

  public childClass: string;
  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem = null;
  public dialogMode = false;
  public compareFn: (o1: any, o2: any) => boolean;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private el: ElementRef,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) @Optional() public dialogData: any,
    @Optional() private dialogRef: MatDialogRef<FsAttributeSelectorWithGroupsComponent>,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    if (this.dialogData && this.dialogData.class) {
      this.dialogMode = !!this.dialogData;
      this.klass = this.dialogData.class;
      this.childClass = this.dialogData.childClass;
      this.data = this.dialogData.data;

      this.selectedAttributes = this.dialogData.selectedAttributes;
      this.showCreate = this.dialogData.showCreate;

      this.initDialog();
    } else {
      this.hostClass = 'fs-attribute fs-attribute-' + this.klass;
      Object.assign(this.data, { childAttributes: true });
    }

    this.attributeConfig = this.attributesConfig.getConfig(this.klass);

    this.compareFn = this.getCompareFn();

    this.fetch();
  }

  public getCompareFn() {
    if (this.dialogData && this.dialogData.class) {
      return this.attributesConfig.compareAttributes.bind(this.attributesConfig);
    } else {
      return this.attributesConfig.compare.bind(this.attributesConfig);
    }
  };

  public selectedToggle(event) {

    this.selectedToggled.emit({
      selected: event.selected,
      value: event.value.toJSON(),
    });

    event.data = this.data;
    event.klass = this.childClass;
    event.queryConfigs = this.queryConfigs;
    event.attribute = event.value;

    this.attributesConfig.attributeSelectionChanged(event)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: any) => {
      });
  }

  public done() {
    this.dialogRef.close({ attributes: this.selectedAttributes });
  }

  public create() {
    const attribute = new AttributeItem(
      { class: this.attributeConfig.childClass },
      this.attributesConfig,
    );

    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        klass: this.attributeConfig.childClass,
        selectParent: this.attributeConfig.klass,
        mode: 'create',
        queryConfigs: this.queryConfigs,
      },
      panelClass: [
        `fs-attribute-dialog`,
        `fs-attribute-dialog-no-scroll`,
        `fs-attribute-${this.attributeConfig.childClass}`
      ],
    });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this._destroy$)
    )
    .subscribe(response => {
      this.fetch(
        null,
        {
        parentId: response?.parent.id,
        attrId: response?.attribute.id,
      });
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private initDialog() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick()
      .pipe(takeUntil(this._destroy$))
      .subscribe(result => {
        this.done();
      });
  }

  /**
   *
   * @param keyword
   * @param autoSelectAttr - param which can be passed for automatically select some attr after fetch
   */
  private fetch(keyword = null, autoSelectAttr = null) {
    const e = {
      query: {},
      keyword: keyword,
      class: this.klass,
      data: this.data,
      queryConfigs: this.queryConfigs,
    };

    this.attributesConfig.getAttributes(e)
      .pipe(
        takeUntil(this._destroy$)
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
              value: attribute
            }
            this.selectedToggle(event);
          }
        }

        this.cdRef.markForCheck();
      });
  }

  public search(text) {
    this.fetch(text);
  }
}
