import { Component, Inject } from '@angular/core';


import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeTreeComponent } from '../../../../src/app/components/attribute-tree/attribute-tree.component';
import { FsAttributeTemplateDirective } from '../../../../src/app/directives/attribute-template.component';


@Component({
    selector: 'tree-example',
    templateUrl: './tree-example.component.html',
    styleUrls: ['./tree-example.component.scss'],
    standalone: true,
    imports: [FsAttributeTreeComponent, FsAttributeTemplateDirective],
})
export class TreeExampleComponent {

  constructor(
    @Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig,
  ) {}
}
