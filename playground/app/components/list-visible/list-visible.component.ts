import { Component, OnInit, inject } from '@angular/core';

import { FS_ATTRIBUTE_FIELD_DATA } from 'src/app/providers';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'list-visible',
    templateUrl: './list-visible.component.html',
    styleUrls: ['./list-visible.component.scss'],
    standalone: true,
    imports: [MatIcon],
})
export class ListVisibleComponent implements OnInit {
  data = inject(FS_ATTRIBUTE_FIELD_DATA);


  public ngOnInit() {

  }
}
