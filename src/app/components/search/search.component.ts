import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'fs-attribute-search',
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.scss'
  ]
})
export class AttributeSearchComponent {

  @Output()
  public keyword = new EventEmitter();

  public searchText = '';

  public modelChange(text) {
    this.keyword.emit(text);
  }
}