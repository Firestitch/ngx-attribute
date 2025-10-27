import { Component, OnInit, SkipSelf, inject } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';

import { FS_ATTRIBUTE_FIELD_DATA } from 'src/app/providers';
import { MatCheckbox } from '@angular/material/checkbox';
import { FsFormModule } from '@firestitch/form';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';


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
    standalone: true,
    imports: [
        MatCheckbox,
        FormsModule,
        FsFormModule,
        MatFormField,
        MatInput,
    ],
})
export class EditVisibleComponent implements OnInit {
  data = inject(FS_ATTRIBUTE_FIELD_DATA);


  public ngOnInit() {
    if (!this.data.attribute.configs) {
      this.data.attribute.configs = {};
    }
  }
}
