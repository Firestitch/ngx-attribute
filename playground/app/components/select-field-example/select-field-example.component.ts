import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'select-field-example',
  templateUrl: 'select-field-example.component.html',
  styleUrls: ['select-field-example.component.scss']
})
export class SelectFieldExampleComponent implements OnInit {

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  public attribute;

  ngOnInit() {
    // setTimeout(() => {
    //   this.attribute = { id: 2 }
    // },1000)
  }

  changed(e) {
    console.log(e);
  }

  save() {

  }
}
