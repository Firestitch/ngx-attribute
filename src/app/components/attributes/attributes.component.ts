import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostBinding,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

import { AttributesConfig } from '../../services/attributes-config';


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

  @Input()
  public data;

  @Input()
  @HostBinding('class.active')
  public active: boolean;

  @Output()
  public dataReceived = new EventEmitter();

  // @HostBinding('class')
  // public hostClass = '';

  public _destroy$ = new Subject();

  constructor(
    public el: ElementRef,
    public attributesConfig: AttributesConfig,
  ) {}

  public ngOnInit() {
    if (this.data) {
      this.fetch();
    }

    this.el.nativeElement.classList.add('fs-attribute');
    this.el.nativeElement.classList.add('fs-attribute-' + this.klass);
    // this.hostClass = 'fs-attribute fs-attribute-' + this.klass;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public fetch() {
    const e = {
      data: this.data,
      class: this.klass
    };

    this.attributesConfig.getSelectedAttributes(e)
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        this.attributes = response.data;
        this.dataReceived.emit(cloneDeep(response.data));
      });
  }
}
