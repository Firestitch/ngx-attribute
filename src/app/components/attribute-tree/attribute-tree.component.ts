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

import { FsTreeChange, FsTreeComponent, ITreeConfig, TreeActionType, FsTreeModule } from '@firestitch/tree';

import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { FsAttributeTemplateDirective } from '../../directives/attribute-template.component';
import { AttributeModel } from '../../models/attribute';
import { AttributeConfigModel } from '../../models/attribute-config';
import { AttributeService } from '../../services';
import { FsAttributeEditComponent } from '../attribute-edit';
import { MatButton } from '@angular/material/button';
import { FsFormModule } from '@firestitch/form';
import { FsMenuModule } from '@firestitch/menu';
import { NgTemplateOutlet } from '@angular/common';


@Component({
    selector: 'fs-attribute-tree',
    templateUrl: './attribute-tree.component.html',
    styleUrls: ['./attribute-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButton,
        FsFormModule,
        FsMenuModule,
        FsTreeModule,
        NgTemplateOutlet,
    ],
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

  public attributes: AttributeModel[] = [];
  public attributeConfig: AttributeConfigModel;
  public childAttributeConfig: AttributeConfigModel;
  public treeConfig: ITreeConfig<any>;

  private _destroy$ = new Subject();

  constructor(
    public attributeService: AttributeService,
    private _dialog: MatDialog,
    private _cdRef: ChangeDetectorRef,
  ) {}


  public ngOnInit() {
    this.attributeConfig = this.attributeService.getConfig(this.class);
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

    const attribute = new AttributeModel(
      { class: this.attributeConfig.class },
      this.attributeService.getConfig(this.attributeConfig.class),
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
          const data = new AttributeModel(result.attribute, this.attributeService.getConfig(result.attribute.class));

          this.tree.append(data.getData());
        }
      });
  }

  private _loadData() {
    this.attributeService.getAttributeTree({
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

            this.attributeService.reorderAttributeTree(event)
              .pipe(
                takeUntil(this._destroy$),
              )
              .subscribe();
          } break;
        }
      },
      sortBy: this.attributeService.sortByAttributeTree.bind(this.attributeService),
      canDrop: this.attributeService.canDropAttribute.bind(this.attributeService),
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
                      const data = new AttributeModel(result.attribute, orig.attributeService, orig.parent);

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
                const attribute = new AttributeModel(
                  { class: this.attributeConfig.childClass },
                  this.attributeService.getConfig(this.attributeConfig.childClass),
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

                      const data = new AttributeModel(
                        result.attribute,
                        orig.attributeService,
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
    this.attributeService.deleteConfirmation(node.data.original)
      .pipe(
        switchMap(() => {
          return this.attributeService.deleteAttribute(node.data.original);
        }),
        tap(() => this.tree.remove(node)),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }
}
