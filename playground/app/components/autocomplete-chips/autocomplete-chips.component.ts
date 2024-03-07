import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';


@Component({
  selector: 'autocomplete-chips',
  templateUrl: 'autocomplete-chips.component.html',
  styleUrls: ['autocomplete-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteChipsComponent {

  public attributes;
  public class = 'person';

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) public attributeConfig: FsAttributeConfig) {}

  public changed(e) {
    console.log(e);
  }

  public staticClick(e) {
    console.log('static clicked');
  }

  public save() {

  }
}
