import { Component, OnInit, inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FsAttributeFieldGroupsComponent } from '../../../../src/app/components/attribute-field-groups/attribute-field-groups.component';


@Component({
    selector: 'field-with-groups-example',
    templateUrl: 'field-with-groups-example.component.html',
    styleUrls: ['field-with-groups-example.component.scss'],
    standalone: true,
    imports: [FsAttributeFieldGroupsComponent]
})
export class FieldWithGroupsExampleComponent implements OnInit {
  private attributeConfig = inject<FsAttributeConfig>(FS_ATTRIBUTE_CONFIG);


  ngOnInit() {
  }

  changed(attributes) {
    console.log(attributes);
  }
}
