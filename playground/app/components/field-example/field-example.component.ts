import { Component, OnInit } from '@angular/core';
import { random } from 'lodash-es';
import { of } from 'rxjs';

@Component({
  selector: 'field-example',
  templateUrl: 'field-example.component.html',
  styleUrls: ['field-example.component.scss']
})
export class FieldExampleComponent implements OnInit {

  public attributes = [
    {
      class: 'everything',
      backgroundColor: '#19A8E2',
      textColor: '#fff',
      image: this.image(),
      name: 'Attribute 1'
    },
    {
      class: 'everything',
      backgroundColor: '#19A8E2',
      textColor: '#fff',
      image: this.image(),
      name: 'Attribute 2'
    },
    {
      class: 'everything',
      backgroundColor: '#19A8E2',
      textColor: '#fff',
      image: this.image(),
      name: 'Attribute 3'
    },
    {
      class: 'everything',
      backgroundColor: '#19A8E2',
      textColor: '#fff',
      image: this.image(),
      name: 'Attribute 4'
    }
  ];

  public selectedAttributes = [];

  ngOnInit() {
    this.selectedAttributes = this.attributes.slice(0).slice(1, 2);
  }

  image() {
    return 'https://unsplash.it/30/30?' + random(0, 9999999);
  }

  public fetch = (query) => {
    return of(this.attributes);
  }
}
