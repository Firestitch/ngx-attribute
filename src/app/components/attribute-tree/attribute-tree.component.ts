import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material';

import { FsTreeChange, FsTreeComponent, ITreeConfig, TreeActionType } from '@firestitch/tree';

import { filter } from 'lodash-es';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsAttributeEditComponent } from '../attribute-edit';
import { AttributesConfig } from '../../services/attributes-config';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributeItem } from '../../models/attribute';


@Component({
  selector: 'fs-attribute-tree',
  templateUrl: './attribute-tree.component.html',
  styleUrls: ['./attribute-tree.component.scss'],
})
export class FsAttributeTreeComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input('class')
  public klass;

  @Input()
  public heading;

  @Input()
  public showExpand = true;

  @Input()
  public showCollapse = true;

  @Input()
  public showCreate = true;

  // @Output()
  // public changed = new EventEmitter();

  @ViewChild(FsTreeComponent)
  public tree: FsTreeComponent<any>;

  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem;
  public childAttributeConfig: AttributeConfigItem;

  public treeConfig: ITreeConfig<any>;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private dialog: MatDialog,
  ) {}


  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.klass);
    this.childAttributeConfig = this.attributeConfig.child;

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

    const attribute = new AttributeItem(
      { class: this.attributeConfig.klass },
      this.attributesConfig
    );

    const dialogRef = this.dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        klass: this.klass,
        mode: 'create',
      },
      panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.attribute) {
        const data = new AttributeItem(result.attribute, this.attributesConfig);

        this.tree.appendElement(data.getData())
      }
    });
  }

  private _loadData() {
    this.attributesConfig.getAttributeTree({
      class: this.klass
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.attributes = response.data;
          this._setTreeConfig();
        }
      });
  }

  private _setTreeConfig() {
    this.treeConfig = {
      data: this.attributes,
      levels: 2,
      selection: false,
      childrenName: this.attributeConfig.mapping.childAttributes,
      changed: (data) => {
        const payload = data.payload;

        switch (data.type) {
          case FsTreeChange.Reorder: {
            const node = payload.node;
            const item = node && payload.node.data && payload.node.data.original;

            const event: any = {
              class: item.klass,
              data: this.data,
              attribute: item,
              fromParent: payload.fromParent && payload.fromParent.data.id,
              toParent: payload.toParent && payload.toParent.data.id,
            };

            if (node && Array.isArray(node.children)) {
              event.children = node.children.map((child) => child.data.id);
            }

            if (!node.parent) {
              event.parentIds = this.tree.getData().map((rootNode) => {
                return rootNode.id
              });
            } else {
              event.childIds = node.parent.children.map((child) => child.data.id);
            }

            this.attributesConfig.reorderAttributeTree(event)
              .subscribe(() => {
              });
          } break;
        }
      },
      sortBy: this.attributesConfig.sortByAttributeTree.bind(this.attributesConfig),
      canDrop: this.attributesConfig.canDropAttribute.bind(this.attributesConfig),
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
                    attribute: node.data.original,
                    klass: node.data.class,
                    data: this.data,
                    parent: node.parent && node.parent.data,
                    mode: 'edit',
                  },
                  panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
                });

                dialogRef.afterClosed()
                  .pipe(
                    takeUntil(this._destroy$),
                  )
                  .subscribe((result) => {
                    if (result) {
                      const orig = node.data.original;
                      const data = new AttributeItem(result.attribute, orig.attributesConfig, orig.parent);

                      this.tree.updateElementData(data.getData(), node);
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
                const attribute = new AttributeItem(
                  { class: this.attributeConfig.childClass },
                  this.attributesConfig
                );

                const dialogRef = this.dialog.open(FsAttributeEditComponent, {
                  data: {
                    attribute: attribute,
                    klass: this.attributeConfig.childClass,
                    data: this.data,
                    parent: node.data,
                    mode: 'create',
                  },
                  panelClass: [`fs-attribute-dialog`, `fs-attribute-dialog-no-scroll`, `fs-attribute-${this.klass}`],
                });

                dialogRef.afterClosed()
                  .pipe(
                    takeUntil(this._destroy$),
                  )
                  .subscribe((result) => {
                    if (result && result.attribute) {
                      const orig = node.data.original;

                      const data = new AttributeItem(
                        result.attribute,
                        orig.attributesConfig,
                        node.data.original
                      );

                      this.tree.appendElement(data.getData(), node);
                    }
                  });
              }
            },
            {
              label: 'Delete',
              click: (node) => {
                this._deteleNode(node);
              }
            },
          ]
        }
      ]
    };
  }

  private _deteleNode(node) {
    this.attributesConfig.deleteConfirmation(node.data.original)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.attributesConfig.deleteAttribute(node.data.original)
            .subscribe(() => {
              this.tree.removeNode(node);
            });
        },
        error: () => {

        },
      });
  }
}
