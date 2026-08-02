import { ChangeDetectionStrategy, Component, Injector, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';

import { FS_ATTRIBUTE_FIELD_DATA } from '../../../providers';
import { NgComponentOutlet } from '@angular/common';

@Component({
    selector: 'fs-attribute-component-wrapper',
    template: '<ng-container *ngComponentOutlet="component; injector: customInjector"></ng-container>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgComponentOutlet],
})
export class FsAttributeComponentWrapperComponent implements OnInit, OnChanges {
  private _injector = inject(Injector);


  @Input() public field: any;
  @Input() public data: any;
  @Input() public component: any;

  public customInjector;

  public ngOnChanges(changes: SimpleChanges) {
    if(changes.data && !changes.data.firstChange) {
      this._initCustomInjector();
    }
  }

  public ngOnInit() {
    this._initCustomInjector();
  }

  /**
   * The injected field data is a snapshot of the data input, so it has to be rebuilt whenever that
   * input is re-bound (eg. a tracked @for over refetched list rows reusing this instance), or the
   * projected component keeps reading the row it was first constructed with.
   *
   * The new Injector identity is also what makes ngComponentOutlet recreate that component, so a
   * component that reads FS_ATTRIBUTE_FIELD_DATA once on construction still sees fresh data.
   */
  private _initCustomInjector() {
    this.customInjector = Injector.create({
      providers: [
        {
          provide: FS_ATTRIBUTE_FIELD_DATA,
          useValue: {
            field: this.field,
            attribute: this.data,
          },
        },
      ],
      parent: this._injector,
    });
  }
}
