import { Component, EnvironmentInjector, EventEmitter, HostBinding, inject, Input, OnChanges, OnInit, Output, runInInjectionContext, SimpleChanges } from '@angular/core';

import { AttributeConfig, FsAttributeConfig } from '../../interfaces';
import { AttributeConfigModel, AttributeModel } from '../../models';
import { AttributeService } from '../../services';
import { FsChipModule } from '@firestitch/chip';


@Component({
    selector: 'fs-attribute',
    templateUrl: './attribute.component.html',
    styleUrls: ['./attribute.component.scss'],
    standalone: true,
    imports: [FsChipModule],
})
export class FsAttributeComponent implements OnInit, OnChanges {

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
  public attributeConfig: AttributeConfig;

  @Input()
  public fsAttributeConfig: FsAttributeConfig;

  @Input() public attribute;

  @Input('class')
  public class = '';

  @Output()
  public selectedToggled = new EventEmitter();

  public attributeConfigItem: AttributeConfigModel;
  public attributeModel: AttributeModel;

  private _attributeService = inject(AttributeService);
  private _envInj = inject(EnvironmentInjector);

  public ngOnChanges(changes: SimpleChanges) {
    if(changes.attribute && !changes.attribute.firstChange) {
      this._initAttributeModel();
    }
  }

  public ngOnInit() {
    this._attributeService = this.fsAttributeConfig ?
      runInInjectionContext(this._envInj, () =>  (new AttributeService()).init(this.fsAttributeConfig)) :
      this._attributeService;

    this.attributeConfigItem = this.attributeConfig ?
      new AttributeConfigModel(this.attributeConfig) :
      this._attributeService.getConfig(this.class || this.attribute.class);

    this._initAttributeModel();

    this.hostClass = `fs-attribute fs-attribute-${this.attributeConfigItem.class}`;
  }

  /**
   * The attribute input stays raw. Its mapped/config-gated form is derived here so that
   * re-binding the input (eg. a tracked @for over refetched list rows reusing this instance)
   * can never leave the template reading unmapped values off the raw attribute.
   */
  private _initAttributeModel() {
    this.attributeModel = this.attribute instanceof AttributeModel ?
      this.attribute :
      new AttributeModel(
        this.attribute,
        this.attributeConfigItem,
      );
  }
}

