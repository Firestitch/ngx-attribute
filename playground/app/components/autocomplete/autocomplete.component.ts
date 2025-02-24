import { Component, Inject, OnInit } from '@angular/core';

import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';


@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {

  public attribute;
  public class = 'person';

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) public attributeConfig: FsAttributeConfig) {}

  public ngOnInit() {

  }

  public changed(e) {
    console.log(e);
  }

  public save() {

  }

  public staticClick(e) {
    console.log('static clicked');
  }
}
