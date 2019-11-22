import { Component, OnInit, Inject } from '@angular/core';
import { FsAttributeListAction } from '@firestitch/attribute';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';

@Component({
  selector: 'list-example',
  templateUrl: 'list-example.component.html',
  styleUrls: ['list-example.component.scss']
})
export class ListExampleComponent implements OnInit {

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  public actions: FsAttributeListAction[] = [
    {
      click: (event) => {
        console.log(event);
      },
      primary: false,
      label: 'Secondary Button'
    },
  ];

  ngOnInit() {

  }
}
