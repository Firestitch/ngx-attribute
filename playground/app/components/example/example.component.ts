import { Component } from '@angular/core';

@Component({
  selector: 'example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.scss']
})
export class ExampleComponent {

  public image;
  public showImage;
  public removable;
  public outlined = false;
  public selected = false;
  public selectable = false;
  public backgroundColor = '';
  public color;
  public config: any = {};

  imageChanged() {
    this.image = this.showImage ? '/assets/headshot2.jpg' : '';
  }

  selectionChanged(e) {
    this.selected = e.selected;
  }

}
