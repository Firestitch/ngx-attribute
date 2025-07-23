import { InjectionToken } from '@angular/core';

import { FsAttributeConfig } from './interfaces';


export const FS_ATTRIBUTE_CONFIG = new InjectionToken<FsAttributeConfig>('fs-attribute.config');
export const FS_ATTRIBUTE_FIELD_DATA = new InjectionToken<any>('fs-attribute.field-data');
