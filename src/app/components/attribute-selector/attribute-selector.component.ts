import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: 'attribute-selector.component.html',
  styleUrls: [ 'attribute-selector.component.scss' ]
})
export class FsAttributeSelectorComponent implements OnInit {

  public selectedAttributes = [];
  public attributes = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FsAttributeSelectorComponent>) {
    this.selectedAttributes = this.data.selectedAttributes;
  }

  ngOnInit() {

    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(result => {
      this.done();
    });

    this.data.fetch()
    .subscribe(response => {
      this.attributes = response;
    });
  }

  done() {
    this.dialogRef.close({ attributes: this.selectedAttributes });
  }

  create() {

  }

  manage() {

  }
}
