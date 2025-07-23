import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';


import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';


@Component({
  selector: 'attribtues-example',
  templateUrl: './attribtues-example.component.html',
  styleUrls: ['./attribtues-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttribtuesExampleComponent implements OnInit {

  public attributes = [{}];

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private _attributeConfig: FsAttributeConfig) {}

  public ngOnInit() {
    this._attributeConfig.attributes.fetch({ class: 'person' })
      .subscribe((response) => {
        console.log(response.data);
        this.attributes = response.data;
      });
  }
}
