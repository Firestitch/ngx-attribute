import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'fs-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: [ 'attributes.component.scss' ],
  host: { class: 'fs-attributes' }
})
export class FsAttributesComponent implements OnInit, OnDestroy {

  @Input() config: any;
  @Input() attributes: any = [];
  @Input('class') klass: string;

  public $destroy = new Subject();

  constructor() {}

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  ngOnInit() {


  }
}
