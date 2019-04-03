import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { FsTreeComponent, ITreeConfig, TreeActionType } from '@firestitch/tree';

import { filter } from 'lodash-es';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsAttributeConfig } from '../../interfaces/attribute-config.interface'
import { FS_ATTRIBUTE_CONFIG } from '../../providers';
import { FsAttributeEditComponent } from '../attribute-edit';


@Component({
  selector: 'fs-attribute-tree',
  templateUrl: './attribute-tree.component.html',
  styleUrls: ['./attribute-tree.component.scss'],
})
export class FsAttributeTreeComponent implements OnInit, OnDestroy {
  public attributes: any = [];
  public attributeConfig: any = {};
  public childAttributeConfig: any = {};

  @Input() data;
  @Input('class') klass;
  @Input() heading;
  @Input() showExpand = true;
  @Input() showCollapse = true;
  @Input() showCreate = true;
  @Output() changed = new EventEmitter();

  @ViewChild(FsTreeComponent)
  public tree: FsTreeComponent<any>;

  public treeConfig: ITreeConfig<any>;

  private _destroy$ = new Subject();

  constructor(private dialog: MatDialog,
              @Inject(FS_ATTRIBUTE_CONFIG) private fsAttributeConfig: FsAttributeConfig) {
  }


  public ngOnInit() {
    this.attributeConfig = filter(this.fsAttributeConfig.configs, { class: this.klass })[0] || {};
    this.childAttributeConfig = filter(this.fsAttributeConfig.configs, { class: this.attributeConfig.childClass })[0] || {};

    this._loadData();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public collapseAll() {
    this.tree.collapseAll();
  }

  public expandAll() {
    this.tree.expandAll();
  }

  public createRootNode() {
    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attibute: {},
        class: this.klass,
        type: 'tree',
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response && response.attribute) {
        this.tree.appendElement(response.attribute)
      }
    });
  }

  private _loadData() {
    this.fsAttributeConfig.getAttributeTree({
      class: this.klass
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response && response.attributes) {
          this.attributes = response.attributes;
          this._setTreeConfig();
        }
      });
  }

  private _setTreeConfig() {
    this.treeConfig = {
      data: this.attributes,
      levels: 2,
      selection: false,
      childrenName: this.fsAttributeConfig.mapping.childAttributes,
      changed: (data) => {
        this.changed.next(data);
      },
      sortBy: this.fsAttributeConfig.sortByAttributeTree,
      canDrop: this.fsAttributeConfig.reorderAttributeTree,
      actions: [
        {
          type: TreeActionType.Menu,
          icon: 'move_vert',
          items: [
            {
              label: 'Edit',
              click: (node) => {
                const dialogRef = this.dialog.open(FsAttributeEditComponent, {
                  data: {
                    attribute: node.data,
                    class: node.data.class,
                    data: this.data,
                    parent: node.parent && node.parent.data,
                  }
                });

                dialogRef.afterClosed()
                  .pipe(
                    takeUntil(this._destroy$),
                  )
                  .subscribe((result) => {
                    if (result) {
                      this.tree.updateElementData(result.attribute, node);
                    }
                  });
              }
            },
            {
              label: 'Create ' + this.childAttributeConfig.name,
              show: (node) => {
                return node.level === 0;
              },
              click: (node) => {
                const dialogRef = this.dialog.open(FsAttributeEditComponent, {
                  data: {
                    attribute: {},
                    class: this.attributeConfig.childClass,
                    data: this.data,
                    parent: node.data,
                  }
                });

                dialogRef.afterClosed()
                  .pipe(
                    takeUntil(this._destroy$),
                  )
                  .subscribe((response) => {
                    if (response && response.attribute) {
                      this.tree.appendElement(response.attribute, node);
                    }
                  });
              }
            },
            {
              label: 'Delete',
              click: (node) => {
                this.fsAttributeConfig.deleteAttribute(node.data)
                  .subscribe(() => {
                    this.tree.removeNode(node);
                  });
              }
            },
          ]
        }
      ]
    };
  }
}
