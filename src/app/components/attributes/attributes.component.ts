import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'fs-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: [ 'attributes.component.scss' ],
  host: { class: 'fs-attributes' }
})
export class FsAttributesComponent implements OnInit, OnDestroy {

  @Input()
  public config: any;

  @Input()
  public attributes: any = [];

  @Input('class')
  public klass: string;

  public _destroy$ = new Subject();

  constructor() {}

  public ngOnInit() {
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
