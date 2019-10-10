import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'fs-attribute-search',
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
