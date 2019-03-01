import { Component, Input } from '@angular/core';

@Component({
  selector: 'fs-attribute',
  templateUrl: 'attribute.component.html',
  styleUrls: [ 'attribute.component.scss' ],
})
export class FsAttributeComponent {

  @Input() config: any = { textColor: '#fff' };

  @Input('backgroundColor') set backgroundColor(value) {
    this.config.backgroundColor = value;
  }

  @Input('textColor') set textColor(value) {
    this.config.textColor = value;
  }

  @Input('image') set image(value) {
    this.config.image = value;
  }

  @Input('removable') set removable(value) {
    this.config.removable = value;
  }

  constructor() {
  }
}
