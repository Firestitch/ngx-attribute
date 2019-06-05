import { Component, OnInit, Inject, SkipSelf } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG, FS_ATTRIBUTE_FIELD_DATA } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { ControlContainer } from '@angular/forms';


@Component({
  selector: 'edit-visible',
  templateUrl: 'edit-visible.component.html',
  styleUrls: ['edit-visible.component.scss'],
  // Required when using form validation so that the parent form is visible
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }]
})
export class EditVisibleComponent implements OnInit {

  constructor(
    @Inject(FS_ATTRIBUTE_FIELD_DATA) public data,
    @Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig
  ) {}

  ngOnInit() {
    if (!this.data.attribute.configs) {
      this.data.attribute.configs = {};
    }
  }
}
