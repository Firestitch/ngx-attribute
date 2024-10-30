import { Component, Inject } from '@angular/core';


import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';


@Component({
  selector: 'tree-example',
  templateUrl: './tree-example.component.html',
  styleUrls: ['./tree-example.component.scss'],
})
export class TreeExampleComponent {

  constructor(
    @Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig,
  ) {}
}
