import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FsAttributeFieldComponent } from '../../../../src/app/components/attribute-field/attribute-field.component';


@Component({
    selector: 'field-example',
    templateUrl: 'field-example.component.html',
    styleUrls: ['field-example.component.scss'],
    standalone: true,
    imports: [FsAttributeFieldComponent]
})
export class FieldExampleComponent implements OnInit {

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  ngOnInit() {
  }

  changed(attributes) {
    console.log(attributes);
  }
}
