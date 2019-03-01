import { Component, Input } from '@angular/core';

@Component({
  selector: 'fs-attribute-chip',
  templateUrl: 'attribute-chip.component.html',
  styleUrls: [ 'attribute-chip.component.scss' ]
})
export class FsAttributeChipComponent {

  @Input() config: any = {};

  constructor() {
  }
}
