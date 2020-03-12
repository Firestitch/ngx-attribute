import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.component.html',
  styleUrls: ['autocomplete.component.scss']
})
export class AutocompleteCComponent implements OnInit {

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
