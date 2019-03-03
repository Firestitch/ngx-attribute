import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { remove } from 'lodash-es';


@Component({
  selector: 'fs-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: [ 'attributes.component.scss' ],
  host: { class: 'fs-attributes' }
})
export class FsAttributesFieldComponent implements OnInit, OnDestroy {

  @Output() selectionChanged = new EventEmitter();
  @Input() config: any;
  @Input() attributes: any = [];
  @Input() selected: any = [];
  @Input() selectable: Boolean;

  public $destroy = new Subject();

  constructor() {
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  ngOnInit() {
    if (this.selectable) {
      this.selectionChanged
      .pipe(takeUntil(this.$destroy))
      .subscribe((e: any) => {

        if (e.selected) {
          this.selected.push(e.attribute);
        } else {
          remove(this.selected, (attribute) => {
            return e.attribute == attribute;
          });
        }
      });
    }
  }
}
