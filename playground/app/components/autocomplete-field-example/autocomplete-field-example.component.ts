import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'autocomplete-field-example',
  templateUrl: 'autocomplete-field-example.component.html',
  styleUrls: ['autocomplete-field-example.component.scss']
})
export class AutocompleteFieldExampleComponent implements OnInit {

  public attribute;

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  public ngOnInit() {
    /*setTimeout(() => {
      this.attribute = [{ id: 2, class: 'everything', name: 'test' }]
    }, 5000)*/
  }

  public changed(e) {
    console.log(e);
  }

  public save() {

  }
}
