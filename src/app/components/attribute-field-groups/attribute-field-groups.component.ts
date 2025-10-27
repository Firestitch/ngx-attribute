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

import { AttributeModel } from '../../models/attribute';
import { AttributeConfigModel } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeSelectorWithGroupsComponent } from '../selector-with-groups/selector-with-groups.component';
import { FsLabelModule } from '@firestitch/label';
import { FsAttributeComponent } from '../attribute/attribute.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'fs-attribute-field-groups',
    templateUrl: './attribute-field-groups.component.html',
    styleUrls: ['../attribute-field/attribute-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsLabelModule,
        FsAttributeComponent,
        MatIconButton,
        MatIcon,
    ],
})
export class FsAttributeFieldGroupsComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input()
  public showCreate = true;

  @Input('class')
  public class: string;

  @Input()
  public mode;

  @Input()
  public set heading(value) {
    this.title = value;
  }

  @Output()
  public changed = new EventEmitter<AttributeModel[]>();

  public title: string | boolean;
  public attributes: AttributeModel[] = [];
  public selectedAttributes: AttributeModel[] = [];

  public attributeConfig: AttributeConfigModel;
  private _destroy$ = new Subject();

  constructor(
    public attributeService: AttributeService,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.attributeConfig = this.attributeService.getConfig(this.class);

    if (this.title === undefined && this.attributeConfig.child) {
      this.title = this.attributeConfig.child.pluralName;
    }

    const e = {
      data: this.data,
      parentClass: this.class,
      class: this.attributeConfig.childClass,
    };

    this.attributeService.getSelectedAttributes(e)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;

        this.selectedAttributes = this.attributes.reduce((acc, attribute) => {
          acc.push(attribute);

          return acc;
        }, []);

        this._cdRef.markForCheck();
      });

    this.changed
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((attributes) => {
        this.selectedAttributes = attributes;

        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public select() {

    const dialogRef = this._dialog.open(FsAttributeSelectorWithGroupsComponent, {
      data: {
        selectedAttributes: this.selectedAttributes.slice(),
        class: this.class,
        childClass: this.attributeConfig.childClass,
        data: this.data,
        showCreate: this.showCreate,
      },
      panelClass: ['fs-attribute-dialog', `fs-attribute-${this.class}`],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response && response.attributes) {

          const parentAttributeConfig = this.attributeService.getAttributeConfig(this.class);

          const attributes = this.attributeService.sortAttributes(parentAttributeConfig.childClass, response.attributes);

          this.changed.emit(attributes);

          this._cdRef.markForCheck();
        }
      });
  }

}
