import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fs-attribute',
  templateUrl: 'attribute.component.html',
  styleUrls: [ 'attribute.component.scss' ],
})
export class FsAttributeComponent {

  @Input() config: any;
  @Input() removable: any;
  @Input() selectable: any;
  @Input() selected: any;
  @Input() attribute: any = {};
  @Input() class: string;
  @Output() selectionChanged = new EventEmitter();

  constructor() {
  }
}
