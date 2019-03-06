import { Component, Input, OnInit, Inject } from '@angular/core';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { MatDialog } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';

@Component({
  selector: 'fs-attribute-field',
  templateUrl: 'attribute-field.component.html',
  styleUrls: [ 'attribute-field.component.scss' ],
})
export class FsAttributeFieldComponent implements OnInit {

  public selectedAttributes: any = [];

  @Input() data;
  @Input('class') class;

  constructor(private dialog: MatDialog,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {}

  public select() {
    const dialogRef = this.dialog.open(FsAttributeSelectorComponent, {
      data: {
        selectedAttributes: this.selectedAttributes,
        class: this.class,
        data: this.data
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response && response.selectedAttributes) {
        this.selectedAttributes = response.selectedAttributes;
      }
    });
  }

  ngOnInit() {
    const e = {
      data: this.data,
      class: this.class
    };

    this.fsAttributeConfig.getSelectedAttributes(e)
    .subscribe((response) => {
      this.selectedAttributes = response.data;
    });
  }
}
