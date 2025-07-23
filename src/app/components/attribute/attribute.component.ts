import { Component, EnvironmentInjector, EventEmitter, HostBinding, inject, Input, OnInit, Output, runInInjectionContext } from '@angular/core';

import { AttributeConfig, FsAttributeConfig } from '../../interfaces';
import { AttributeConfigItem, AttributeItem } from '../../models';
import { AttributeService } from '../../services';


@Component({
  selector: 'fs-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
})
export class FsAttributeComponent implements OnInit {

  @HostBinding('class') public hostClass = '';

  @Input()
  public removable: boolean;

  @Input()
  public selectable: boolean;

  @Input()
  public size: 'small' | 'tiny';

  @Input()
  public selected: boolean;

  @Input()
  public config: AttributeConfig;

  @Input()
  public attributeConfig: FsAttributeConfig;

  public attributeConfigItem: AttributeConfigItem;

  @Input() public attribute;

  @Input('class')
  public class = '';

  @Output()
  public selectedToggled = new EventEmitter();

  private _attributeService = inject(AttributeService);
  private _envInj = inject(EnvironmentInjector);

  public ngOnInit() {    
    this._attributeService = this.attributeConfig ? 
      runInInjectionContext(this._envInj, () =>  (new AttributeService()).init(this.attributeConfig)) :
      this._attributeService;

    this.attributeConfigItem = this.config ? 
      new AttributeConfigItem(this.config) :
      this._attributeService.getConfig(this.class || this.attribute.class);

    if(!(this.attribute instanceof AttributeItem)) {
      this.attribute = new AttributeItem(
        this.attribute,
        this.attributeConfigItem,
      );
    }

    this.hostClass = `fs-attribute fs-attribute-${this.attributeConfigItem.class}`;
  }
}

