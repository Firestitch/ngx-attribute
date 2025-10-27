import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FsAttributeSelectorComponent } from '../../../../src/app/components/attribute-selector/attribute-selector.component';


@Component({
    selector: 'selector-example',
    templateUrl: 'selector-example.component.html',
    styleUrls: ['selector-example.component.scss'],
    standalone: true,
    imports: [FsAttributeSelectorComponent]
})
export class SelectorExampleComponent implements OnInit {

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  ngOnInit() {
  }

  changed(attributes) {
    console.log(attributes);
  }
}
