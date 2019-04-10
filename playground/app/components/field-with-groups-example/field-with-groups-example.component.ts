import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'field-with-groups-example',
  templateUrl: 'field-with-groups-example.component.html',
  styleUrls: ['field-with-groups-example.component.scss']
})
export class FieldWithGroupsExampleComponent implements OnInit {

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  ngOnInit() {
  }

  changed(attributes) {
    console.log(attributes);
  }
}
