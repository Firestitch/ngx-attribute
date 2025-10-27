import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { FsAttributeListAction } from '@firestitch/attribute';

import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeListComponent } from '../../../../src/app/components/attribute-list/attribute-list.component';
import { FsAttributeListColumnDirective } from '../../../../src/app/directives/list-column.directive';

@Component({
    selector: 'list-example',
    templateUrl: 'list-example.component.html',
    styleUrls: ['list-example.component.scss'],
    standalone: true,
    imports: [FsAttributeListComponent, FsAttributeListColumnDirective],
})
export class ListExampleComponent implements OnInit {

  @ViewChild('attributeList', { static: true })
  public attributeList;

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) { }

  public actions: FsAttributeListAction[] = [
    {
      click: (event) => {
        console.log(event);
        this.attributeList.create();
      },
      primary: false,
      label: 'Secondary Button',
    },
  ];

  ngOnInit() {

  }
}
