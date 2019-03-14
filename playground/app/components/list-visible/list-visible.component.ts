import { Component, OnInit, Inject } from '@angular/core';
import { FS_ATTRIBUTE_CONFIG } from 'src/app/providers';
import { FsAttributeConfig } from 'src/app/interfaces/attribute-config.interface';


@Component({
  selector: 'list-visible',
  templateUrl: 'list-visible.component.html',
  styleUrls: ['list-visible.component.scss']
})
export class ListVisibleComponent implements OnInit {

  constructor(@Inject(FS_ATTRIBUTE_CONFIG) private attributeConfig: FsAttributeConfig) {}

  ngOnInit() {

  }
}
