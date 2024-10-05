import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { randomColor } from '@firestitch/colorpicker';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, merge } from 'lodash-es';

import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';
import { getRawAttributeValue } from '../../helpers/raw-attribute-value';


@Component({
  templateUrl: './attribute-edit.component.html',
  styleUrls: [ './attribute-edit.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeEditComponent implements OnInit, OnDestroy {

  public attribute: AttributeItem;
  public attributeConfig: AttributeConfigItem;
  public saving = false;
  public parentSelector: string;
  public selectedParent: AttributeItem;
  public inEditMode = false;

  @ViewChild('submitButton') public submitButton: MatButton = null;

  private _destroy$ = new Subject<void>();

  constructor(
    public attributesConfig: AttributesConfig,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FsAttributeEditComponent>,
    private _cd: ChangeDetectorRef,
  ) {
    const attribute = this.data.attribute;
    this.attribute = attribute && cloneDeep(attribute) || {};

    if (this.data.parent) {
      this.selectedParent = new AttributeItem(this.data.parent, attributesConfig);
    }

    this.inEditMode = this.data.mode === 'edit';

    this.parentSelector = this.data.selectParent;
  }

  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.data.klass);

    if(!this.inEditMode && this.attributeConfig.backgroundColor && !this.attribute.backgroundColor) {
      this.attribute.backgroundColor = randomColor();
    }
  }

  public selectImage(file) {
    const e = {
      attribute: this.attribute,
      class: this.data.klass,
      data: this.data.data,
      file: file,
      queryConfigs: this.data?.queryConfigs,
    };

    this.saving = true;
    this.attributesConfig.saveAttributeImage(e)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response: any) => {
        this.submitButton.disabled = false;

        // TAD-T527 prevent loss config object link (was passed into attribute component wrapper
        if (Array.isArray(response.configs)) {
          delete response.configs;
        }

        // FIXME
        // Save link
        const configs = this.attribute.configs;

        const attribute = merge(response, this.attribute.toJSON());
        this.attribute = new AttributeItem(attribute, this.attributesConfig);

        // restore link
        this.attribute.configs = configs;
      },
      () => {},
      () => {
        this.saving = false;

        this._cd.markForCheck();
      });
  }

  public save() {
    // const mapping = this.fsAttributeConfig.mapping;
    //
    // this.attribute[mapping.name] = this.name;
    // this.attribute[mapping.backgroundColor] = this.backgroundColor;

    this.saveAttribute();
  }

  public saveAttribute() {

    const parent = getRawAttributeValue(this.selectedParent);

    const eventData = {
      attribute: this.attribute,
      class: this.data.klass,
      data: this.data.data,
      parent: parent,
      queryConfigs: this.data?.queryConfigs,
    };

    this.attributesConfig.saveAttribute(eventData)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: any) => {
        response.parent = this.selectedParent;
        this.close(response);
      });
  }

  public close(data = null) {
    this.dialogRef.close(data);
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
