import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  templateUrl: './attribute-manage.component.html',
  styleUrls: ['./attribute-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeManageComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<FsAttributeManageComponent>,
  ) { }

  public close(): void {
    this._dialogRef.close();
  }
}
