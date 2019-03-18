import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { filter } from 'lodash-es';

import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig } from '../../interfaces/attribute-config.interface';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: './attribute-field.component.html',
  styleUrls: [ './attribute-field.component.scss' ],
})
export class FsAttributeFieldComponent implements OnInit, OnDestroy {

  public attributes: any = [];
  public attributeConfig: any = {};

  @Input() data;
  @Input('class') class;
  @Output() changed = new EventEmitter();

  constructor(private dialog: MatDialog,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {}


  ngOnInit() {
    this.fsAttributeConfig.getAttributeTree({})
      .pipe(

      )
      .subscribe((data) => {

        /*
        data =  {
          attrbitues: [
            {
              name: 'Tropial',
              background..

              attrbitues: [
              {
                name: 'Peach',
              }
            ]
            }
          ]
        }

        */
      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
