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
  public class = 'person';

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) public attributeConfig: FsAttributeConfig) {}


  public ngOnInit() {}

  public changed(e) {
    console.log('CHANGED', e);
  }

  public save() {

  }
}
