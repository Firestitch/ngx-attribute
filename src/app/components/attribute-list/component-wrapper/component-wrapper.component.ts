import { ChangeDetectionStrategy, Component, Injector, Input, OnInit, inject } from '@angular/core';

import { FS_ATTRIBUTE_FIELD_DATA } from '../../../providers';
import { NgComponentOutlet } from '@angular/common';

@Component({
    selector: 'fs-attribute-component-wrapper',
    template: '<ng-container *ngComponentOutlet="component; injector: customInjector"></ng-container>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgComponentOutlet],
})
export class FsAttributeComponentWrapperComponent implements OnInit {
  private _injector = inject(Injector);

  
  @Input() public field: any;
  @Input() public data: any;
  @Input() public component: any;

  public customInjector;

  public ngOnInit() {
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
