import {  Component, Input, OnInit, OnChanges,
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
  @Input() outlined: Boolean = false;
  @Input() removable: Boolean = false;
  @Input() backgroundColor: string;
  @Input() borderColor: string;
  @Input() color = '';
  @Input() image: string;

  @Output() clicked = new EventEmitter();
  @Output() selectionChanged = new EventEmitter();

  public $destroy = new Subject();
  public styles = {
    backgroundColor: '',
    borderColor: '',
    color: ''
  };

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

    this.styles.backgroundColor = this. backgroundColor;
    this.styles.borderColor = this. borderColor;
    this.styles.color = this. color;

    if (!this.color && !this.outlined) {
      this.styles.color = this.isContrastYIQBlack(this.backgroundColor) ? '#474747' : '#fff';
    }

    if (this.outlined) {
      this.styles.backgroundColor = '';

      if (this.color) {
        this.styles.borderColor = this.color;
      }
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  ngOnInit() {

    this.clicked
    .pipe(takeUntil(this.$destroy))
    .subscribe(attribute => {
      if (this.selectable) {
        this.selected = !this.selected;
        this.selectionChanged.emit({ attribute: attribute, selected: this.selected });
      }
    });
  }
}
