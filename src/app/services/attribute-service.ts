import { Injectable } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AttributesConfig } from './attributes-config';

import { AttributeConfig } from '../interfaces/attribute-config.interface';
import { AttributeItem } from '../models/attribute';
import { FsAttributeEditComponent } from '../components/attribute-edit';


@Injectable({
  providedIn: 'root',
})
export class FsAttributeService {

  public constructor(
    private _dialog: MatDialog,
    public attributesConfig: AttributesConfig,
  ) { }

  public createAttribute(
    klass: string,
    config: { data?: any; queryConfigs?: any } = {},
  ): MatDialogRef<FsAttributeEditComponent> {
    return this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: new AttributeItem({ class: klass }, this.attributesConfig),
        klass: klass,
        data: config.data,
        mode: 'create',
        queryConfigs: config.queryConfigs,
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${klass}`],
    });
  }
}
