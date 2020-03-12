import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'autocomplete-chips',
  templateUrl: 'autocomplete-chips.component.html',
  styleUrls: ['autocomplete-chips.component.scss']
})
export class AutocompleteChipsComponent implements OnInit {

  public attributes;
  public class = 'person';

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) public attributeConfig: FsAttributeConfig) {}

  public ngOnInit() {
  }


  public changed(e) {
    console.log(e);
  }

  public staticClick(e) {
    console.log('static clicked');
  }

  public save() {

  }
}
