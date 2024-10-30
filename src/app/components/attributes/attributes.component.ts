import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import { FsAttributeTemplateDirective } from '../../directives/attribute-template.component';
import { AttributesConfig } from '../../services/attributes-config';


@Component({
  selector: 'fs-attributes',
  templateUrl: 'attributes.component.html',
  styleUrls: ['attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAttributesComponent implements OnInit, OnDestroy {

  @Input()
  public config: any;

  @Input('attributes') set attributes(value) {
    this._attributes = value;
    this.hasAttributes = value.length;
  }

  public _attributes: any = [];

  @Input('class')
  public class: string;

  @Input()
  public data;

  @Input()
  public size;

  @Input()
  public queryConfigs: any;

  @Input()
  @HostBinding('class.has-attributes')
  public hasAttributes: boolean;


  @Input()
  @HostBinding('class.active')
  public active: boolean;

  @Output()
  public dataReceived = new EventEmitter();

  @ContentChild(FsAttributeTemplateDirective, { read: TemplateRef })
  public templ: TemplateRef<FsAttributeTemplateDirective>;

  // @HostBinding('class')
  // public hostClass = '';

  public _destroy$ = new Subject();

  constructor(
    public el: ElementRef,
    public attributesConfig: AttributesConfig,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    if (this.data) {
      this.fetch();
    }

    this.el.nativeElement.classList.add('fs-attributes');
    this.el.nativeElement.classList.add('fs-attribute');
    this.el.nativeElement.classList.add(`fs-attribute-${  this.class}`);
    // this.hostClass = 'fs-attribute fs-attribute-' + this.class;
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public fetch() {
    const e = {
      data: this.data,
      class: this.class,
      queryConfigs: this.queryConfigs,
    };

    this.attributesConfig.getSelectedAttributes(e)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.attributes = response.data;
        this.dataReceived.emit(cloneDeep(response.data));

        this.cdRef.markForCheck();
      });
  }
}
