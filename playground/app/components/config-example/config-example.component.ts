import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AttributeModel } from '@firestitch/attribute';
import { FsLabelModule } from '@firestitch/label';
import { FsAttributeComponent } from '../../../../src/app/components/attribute/attribute.component';

@Component({
    selector: 'config-example',
    templateUrl: './config-example.component.html',
    styleUrls: ['./config-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsLabelModule, FsAttributeComponent],
})
export class ConfigExampleComponent {

  public attribute = new AttributeModel({
    backgroundColor: '#8942CA',
    color: 'white',
    image: '/assets/headshot1.jpg',
  }, null, null);
}
