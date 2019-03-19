import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG, FS_ATTRIBUTE_FIELD_DATA } from '../../../providers';
import { AttributeConfig, FsAttributeConfig } from '../../../interfaces/attribute-config.interface';

@Component({
  selector: 'fs-attribute-component-wrapper',
  template: `
    <ng-container *ngComponentOutlet="component; injector: customInjector"></ng-container>
  `,
})
export class FsAttributeComponentWrapperComponent implements OnInit {
  @Input() public field: any;
  @Input() public data: any;
  @Input() public component: any;

  public customInjector;

  constructor(private _injector: Injector) {}

  public ngOnInit() {
    this.customInjector = Injector.create({
      providers: [
        {
          provide: FS_ATTRIBUTE_FIELD_DATA,
          useValue: {
            field: this.field,
            attribute: this.data,
          },
        }
      ],
      parent: this._injector
    })
  }
}
