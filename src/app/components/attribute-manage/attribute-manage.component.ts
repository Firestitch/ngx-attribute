import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

import { AttributeConfig, FsAttributeConfig } from '../../interfaces';
import { FsDialogModule } from '@firestitch/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FsAttributeListComponent } from '../attribute-list/attribute-list.component';
import { MatButton, MatAnchor } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';


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
        MatButton,
        FsFormModule,
        MatAnchor,
    ],
})
export class FsAttributeManageComponent {
  data = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<FsAttributeManageComponent>>(MatDialogRef);


  public close(): void {
    this._dialogRef.close();
  }
}
