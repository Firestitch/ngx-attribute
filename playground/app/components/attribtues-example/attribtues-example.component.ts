import { Component, Inject, OnInit } from '@angular/core';


import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';


@Component({
  selector: 'attribtues-example',
  templateUrl: './attribtues-example.component.html',
  styleUrls: ['./attribtues-example.component.scss'],
})
export class AttribtuesExampleComponent implements OnInit {

  public attributes = [{}];

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  ngOnInit() {
    this.attributeConfig.getAttributes({ class: 'person' })
      .subscribe((response) => {
        console.log(response.data);
        this.attributes = response.data;
      });
  }
}
