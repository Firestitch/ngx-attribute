import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsTreeChange, FsTreeComponent, ITreeConfig, TreeActionType } from '@firestitch/tree';

import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { FsAttributeTemplateDirective } from '../../directives/attribute-template.component';
import { AttributeItem } from '../../models/attribute';
import { AttributeConfigItem } from '../../models/attribute-config';
import { AttributesConfig } from '../../services/attributes-config';
import { FsAttributeEditComponent } from '../attribute-edit';


@Component({
  selector: 'fs-attribute-tree',
  templateUrl: './attribute-tree.component.html',
  styleUrls: ['./attribute-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributeTreeComponent implements OnInit, OnDestroy {

  @Input()
  public data;

  @Input('class')
  public class;

  @Input()
  public heading;

  @Input()
  public showExpand = true;

  @Input()
  public showCollapse = true;

  @Input()
  public showCreate = true;

  @ContentChild(FsAttributeTemplateDirective, { read: TemplateRef })
  public templ: TemplateRef<FsAttributeTemplateDirective>;

  @ViewChild(FsTreeComponent)
  public tree: FsTreeComponent<any>;

  public attributes: AttributeItem[] = [];
  public attributeConfig: AttributeConfigItem;
  public childAttributeConfig: AttributeConfigItem;
  public treeConfig: ITreeConfig<any>;

  private _destroy$ = new Subject();

  constructor(
    public attributesConfig: AttributesConfig,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {}


  public ngOnInit() {
    this.attributeConfig = this.attributesConfig.getConfig(this.class);
    this.childAttributeConfig = this.attributeConfig.child;

    this._loadData();
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
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
      { class: this.attributeConfig.class },
      this.attributesConfig.getConfig(this.attributeConfig.class),
    );

    const dialogRef = this._dialog.open(FsAttributeEditComponent, {
      data: {
        attribute: attribute,
        attributeConfig: this.attributeConfig,
        mode: 'create',
      },
      panelClass: ['fs-attribute-dialog', 'fs-attribute-dialog-no-scroll', `fs-attribute-${this.class}`],
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((result) => {
        if (result && result.attribute) {
          const data = new AttributeItem(result.attribute, this.attributesConfig.getConfig(result.attribute.class));

          this.tree.append(data.getData());
        }
      });
  }

  private _loadData() {
    this.attributesConfig.getAttributeTree({
      class: this.class,
    })
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.attributes = response.data;
          this._setTreeConfig();

          this._cdRef.markForCheck();
        }
      });
  }

  private _setTreeConfig() {
    this.treeConfig = {
      data: this.attributes,
      childrenName: this.attributeConfig.mapping.childAttributes,
      change: (data) => {
        const payload = data.payload;

        switch (data.type) {
          case FsTreeChange.Reorder: {
            const node = payload.node;
            const item = node && payload.node.data && payload.node.data.original;

            const event: any = {
              class: item.class,
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
                return rootNode.id;
              });
            } else {
              event.childIds = node.parent.children.map((child) => child.data.id);
            }

            this.attributesConfig.reorderAttributeTree(event)
              .pipe(
                takeUntil(this._destroy$),
              )
              .subscribe();
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
                const dialogRef = this._dialog.open(FsAttributeEditComponent, {
                  data: {
                    attribute: node.data.original,
                    class: node.data.class,
                    data: this.data,
                    parent: node.parent && node.parent.data,
                    mode: 'edit',
                  },
                  panelClass: ['fs-attribute-dialog', 'fs-attribute-dialog-no-scroll', `fs-attribute-${this.class}`],
                });

                dialogRef.afterClosed()
                  .pipe(
                    takeUntil(this._destroy$),
                  )
                  .subscribe((result) => {
                    if (result) {
                      const orig = node.data.original;
                      const data = new AttributeItem(result.attribute, orig.attributesConfig, orig.parent);

                      this.tree.updateNodeData(data.getData(), node);
                    }
                  });
              },
            },
            {
              label: `Create ${  this.childAttributeConfig.name}`,
              show: (node) => {
                return node.level === 0;
              },
              click: (node) => {
                const attribute = new AttributeItem(
                  { class: this.attributeConfig.childClass },
                  this.attributesConfig.getConfig(this.attributeConfig.childClass),
                );

                const dialogRef = this._dialog.open(FsAttributeEditComponent, {
                  data: {
                    attribute: attribute,
                    class: this.attributeConfig.childClass,
                    data: this.data,
                    parent: node.data,
                    mode: 'create',
                  },
                  panelClass: ['fs-attribute-dialog', 'fs-attribute-dialog-no-scroll', `fs-attribute-${this.class}`],
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
                        node.data.original,
                      );

                      this.tree.append(data.getData(), node);
                    }
                  });
              },
            },
            {
              label: 'Delete',
              click: (node) => {
                this._deteleNode(node);
              },
            },
          ],
        },
      ],
    };
  }

  private _deteleNode(node) {
    this.attributesConfig.deleteConfirmation(node.data.original)
      .pipe(
        switchMap(() => {
          return this.attributesConfig.deleteAttribute(node.data.original);
        }),
        tap(() => this.tree.remove(node)),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }
}
