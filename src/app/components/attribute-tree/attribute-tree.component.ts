import { Component, Input, OnInit, Inject, OnDestroy, Output, EventEmitter, HostBinding } from '@angular/core';
import { FsAttributeSelectorComponent } from '../attribute-selector/attribute-selector.component';
import { MatDialog } from '@angular/material';
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeConfig, AttributeConfig } from '../../interfaces/attribute-config.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';


@Component({
  selector: 'fs-attribute-field',
  templateUrl: 'attribute-field.component.html',
  styleUrls: [ 'attribute-field.component.scss' ],
})
export class FsAttributeFieldComponent implements OnInit, OnDestroy {

  public attributes: any = [];
  public attributeConfig: any = {};
  private $destroy = new Subject();

  @Input() data;
  @Input('class') class;
  @Output() changed = new EventEmitter();

  constructor(private dialog: MatDialog,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {}


  ngOnInit() {
    this.fsAttributeConfig.getAttributeTree()
    .pipe(

    )
    .subscribe(data) {

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
    })
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
