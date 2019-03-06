import { Component } from '@angular/core';

@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.scss']
})
export class ExampleComponent {

  public image;
  public removable;
  public backgroundColor = '';
  public textColor;
  public config: any = {};

  public attribute;

  public changed() {
    this.attribute = {
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      image: '/assets/headshot2.jpg'
    };

    this.config = {
      backgroundColor: !!this.backgroundColor,
      textColor: !!this.textColor,
      image: this.image,
      removable: this.removable
    };
  }

}
