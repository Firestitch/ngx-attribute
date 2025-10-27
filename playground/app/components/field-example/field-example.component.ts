import { Component, OnInit, inject } from '@angular/core';
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
  private attributeConfig = inject<FsAttributeConfig>(FS_ATTRIBUTE_CONFIG);


  ngOnInit() {
  }

  changed(attributes) {
    console.log(attributes);
  }
}
