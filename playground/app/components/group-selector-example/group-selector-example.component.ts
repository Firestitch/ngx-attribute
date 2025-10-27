import { Component, OnInit, inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FsAttributeSelectorWithGroupsComponent } from '../../../../src/app/components/selector-with-groups/selector-with-groups.component';


@Component({
    selector: 'group-selector-example',
    templateUrl: 'group-selector-example.component.html',
    styleUrls: ['group-selector-example.component.scss'],
    standalone: true,
    imports: [FsAttributeSelectorWithGroupsComponent]
})
export class GroupSelectorExampleComponent implements OnInit {
  private attributeConfig = inject<FsAttributeConfig>(FS_ATTRIBUTE_CONFIG);


  ngOnInit() {
  }

  changed(attributes) {
    console.log(attributes);
  }
}
