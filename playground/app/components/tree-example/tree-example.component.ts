import { Component, OnInit, Inject, ViewChild, ContentChild } from '@angular/core';

import { FsTreeComponent } from '@firestitch/tree';
import { MatDialog } from '@angular/material/dialog';

import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FsAttributeTreeComponent } from '../../../../src/app/components/attribute-tree';
import { FsAttributeEditComponent } from '../../../../src/app/components/attribute-edit';


@Component({
  selector: 'tree-example',
  templateUrl: 'tree-example.component.html',
  styleUrls: ['tree-example.component.scss']
})
export class TreeExampleComponent implements OnInit {

  constructor(
    @Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig,
  ) {}

  public ngOnInit() {

  }
}
