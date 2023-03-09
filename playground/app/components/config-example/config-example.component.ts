import { Component } from '@angular/core';
import { AttributeItem } from 'src/app/models/attribute';

@Component({
  selector: 'config-example',
  templateUrl: 'config-example.component.html',
  styleUrls: ['config-example.component.scss']
})
export class ConfigExampleComponent {

  public attribute = new AttributeItem({
    backgroundColor: '#8942CA',
    color: 'white',
    image: '/assets/headshot1.jpg'
  }, null, null);
}
