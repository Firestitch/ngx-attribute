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
/*
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

      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  private _setTreeConfig() {
    this.treeConfig = {
        data: this.attributes,
        levels: 2,
        selection: false,
        childrenName: this.fsAttributeConfig.mapping.childAttributes,
        changed: (data) => {
          this.fsAttributeConfig.saveAttributeTree(data);
          // this.changed.next(data);
        },
        canDrop: this.fsAttributeConfig.reorderAttributeTree,
        actions: [
          {
            type: TreeActionType.Menu,
            icon: 'move_vert',
            items: [
              {
                label: 'Create Level 2 Object',
                show: (node) => {
                  return node.level === 0;
                },
                click: (node) => {
                  const dialogRef = this.dialog.open(FsAttributeEditTreeComponent, {
                    data: {
                      attibute: { },
                      mode: 'tree',
                      parentAttribute: node,
                      class: this.klass,
                      data: this.data,
                    }
                  });

                  dialogRef.afterClosed()
                    .pipe(
                      takeUntil(this._destroy$),
                    )
                    .subscribe(data => {
                      // debugger;
                      this.tree.insertElementAbove(data, node);
                    });
                }
            ]
          }
        ]
      }

      *!/
  });*/
}
