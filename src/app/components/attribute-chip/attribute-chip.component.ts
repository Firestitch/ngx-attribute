import {  Component, Input, OnInit, Inject, OnChanges,
          SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-attribute-chip',
  templateUrl: 'attribute-chip.component.html',
  styleUrls: [ 'attribute-chip.component.scss' ]
})
export class FsAttributeChipComponent implements OnInit, OnChanges, OnDestroy {

  @Input() attribute: any;
  @Input() selectable: Boolean = false;
  @Input() selected: Boolean = false;
  @Input() removable: Boolean = false;
  @Input() backgroundColor: string;
  @Input() textColor = '#474747';
  @Input() image: string;

  @Output() clicked = new EventEmitter();
  @Output() selectionChanged = new EventEmitter();

  public $destroy = new Subject();

  private isContrastYIQBlack(hexcolor) {
    if (!hexcolor) {
      return true;
    }

    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 200;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.backgroundColor && !this.textColor) {
      this.textColor = this.isContrastYIQBlack(this.backgroundColor) ? '#474747' : '#fff';
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  ngOnInit() {

    if (this.selectable) {
      this.clicked
      .pipe(takeUntil(this.$destroy))
      .subscribe(attribute => {
        this.selected = !this.selected;
        this.selectionChanged.emit({ attribute: attribute, selected: this.selected });
      });
    }
  }
}
