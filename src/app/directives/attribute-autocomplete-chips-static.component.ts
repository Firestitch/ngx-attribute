import { FsAutocompleteChipsStaticDirective } from '@firestitch/autocomplete-chips';
import { Directive } from '@angular/core';

@Directive({
    selector: '[fsAttributeAutocompleteChipsStatic]',
    standalone: true,
})
export class FsAttributeAutocompleteChipsStaticDirective extends FsAutocompleteChipsStaticDirective {

}
