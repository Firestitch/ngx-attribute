import { Component } from '@angular/core';

@Component({
  selector: 'config-example',
  templateUrl: 'config-example.component.html',
  styleUrls: ['config-example.component.scss']
})
export class ConfigExampleComponent {

  public attribute = {
    backgroundColor: '#8942CA',
    textColor: 'white',
    image: '/assets/headshot1.jpg'
  };
}
