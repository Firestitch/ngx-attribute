import { Component, Inject, OnInit, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';

import { FS_ATTRIBUTE_FIELD_DATA } from 'src/app/providers';


@Component({
  selector: 'edit-visible',
  templateUrl: './edit-visible.component.html',
  styleUrls: ['./edit-visible.component.scss'],
  // Required when using form validation so that the parent form is visible
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
})
export class EditVisibleComponent implements OnInit {

  constructor(
    @Inject(FS_ATTRIBUTE_FIELD_DATA) public data,
  ) {}

  public ngOnInit() {
    if (!this.data.attribute.configs) {
      this.data.attribute.configs = {};
    }
  }
}
