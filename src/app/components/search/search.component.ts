import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FsFormModule } from '@firestitch/form';

@Component({
    selector: 'fs-attribute-search',
    templateUrl: './search.component.html',
    styleUrls: [
        './search.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        MatFormField,
        MatLabel,
        MatPrefix,
        MatIcon,
        MatInput,
        FsFormModule,
    ],
})
export class AttributeSearchComponent {

  @Input()
  public placeholder = 'Search';

  @Output()
  public keyword = new EventEmitter();

  public searchText = '';

  public modelChange(text) {
    this.keyword.emit(text);
  }
}
