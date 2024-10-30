import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AttributeConfig } from '@firestitch/attribute';


@Component({
  selector: 'autocomplete-chips',
  templateUrl: './autocomplete-chips.component.html',
  styleUrls: ['./autocomplete-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteChipsComponent {

  public attributes;
  public class = 'person';
  public attributeConfig: AttributeConfig = {
    class: 'animal',
    name: 'Animal',
    pluralName: 'Animals',
  };


  public changed(e) {
    console.log(e);
  }

  public staticClick(e) {
    console.log('static clicked');
  }

  public save() {
    //
  }
}
