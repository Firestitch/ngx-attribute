import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'field-example',
  templateUrl: 'field-example.component.html',
  styleUrls: ['field-example.component.scss']
})
export class FieldExampleComponent implements OnInit {

  public selectedAttributes = [];

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  ngOnInit() {
  }
}
