import { Component, Input } from '@angular/core';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'fs-attribute-field',
  templateUrl: 'attribute-field.component.html',
  styleUrls: [ 'attribute-field.component.scss' ],
})
export class FsAttributeFieldComponent {

  @Input() config: any;
  @Input() fetch;
  @Input() attributes: any = [];

  constructor(private dialog: MatDialog) {}

  public select() {
    const dialogRef = this.dialog.open(FsAttributeSelectorComponent, {
      data: {
        selectedAttributes: this.attributes,
        fetch: this.fetch
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response && response.attributes) {
        this.attributes = response.attributes;
      }
    });
  }
}
