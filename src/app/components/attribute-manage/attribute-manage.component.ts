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

  public data = inject(MAT_DIALOG_DATA);

  private _dialogRef = inject<MatDialogRef<FsAttributeManageComponent>>(MatDialogRef);

  /**
   * The size to render the list at. Read off the dialog data, falling back to
   * the same default the components carry, so an opener that names no size gets
   * small rather than an explicit undefined binding overriding the child's own
   * default.
   */
  public get size(): 'small' | 'tiny' {
    return this.data.size ?? 'small';
  }

  public close(): void {
    this._dialogRef.close();
  }
}
