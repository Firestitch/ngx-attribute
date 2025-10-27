import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';


import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributesComponent } from '../../../../src/app/components/attributes/attributes.component';


@Component({
    selector: 'attribtues-example',
    templateUrl: './attribtues-example.component.html',
    styleUrls: ['./attribtues-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsAttributesComponent],
})
export class AttribtuesExampleComponent implements OnInit {
  private _attributeConfig = inject<FsAttributeConfig>(FS_ATTRIBUTE_CONFIG);


  public attributes = [{}];

  public ngOnInit() {
    this._attributeConfig.attributes.fetch({ class: 'person' })
      .subscribe((response) => {
        console.log(response.data);
        this.attributes = response.data;
      });
  }
}
