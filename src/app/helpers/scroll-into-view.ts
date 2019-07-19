import { ElementRef } from '@angular/core';


export function scrollIntoView(el: ElementRef) {
  setTimeout(() => {
    el.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}
