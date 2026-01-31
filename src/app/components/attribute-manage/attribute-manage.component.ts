import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';

import { FsAttributeListComponent } from '../attribute-list/attribute-list.component';


@Component({
  templateUrl: './attribute-manage.component.html',
  styleUrls: ['./attribute-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsDialogModule,
    CdkScrollable,
    MatDialogContent,
    FsAttributeListComponent,
    MatDialogActions,
    FsFormModule,
    MatButton,
  ],
})
export class FsAttributeManageComponent {
  data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<FsAttributeManageComponent>>(MatDialogRef);


  public close(): void {
    this._dialogRef.close();
  }
}
