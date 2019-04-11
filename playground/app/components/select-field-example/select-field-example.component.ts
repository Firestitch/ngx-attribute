import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'select-field-example',
  templateUrl: 'select-field-example.component.html',
  styleUrls: ['select-field-example.component.scss']
})
export class SelectFieldExampleComponent implements OnInit {

  public attribute;

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  public ngOnInit() {
    /*setTimeout(() => {
      this.attribute = { id: 2, class: 'everything', name: 'test' }
    }, 1000)*/
  }

  public changed(e) {
    console.log(e);
  }

  public save() {

  }
}
