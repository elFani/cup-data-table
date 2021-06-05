// Angular
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlattenObjectService {

  constructor() {}

  flattenObject = (obj) =>
    Object.keys(obj).reduce((acc, k) => {
      if (typeof obj[k] === 'object') Object.assign(acc, this.flattenObject(obj[k]));
      else acc[k] = obj[k];
      return acc;
    }, {});

  flattenAndPreserveArray(objectsToFlatten) {
    return objectsToFlatten.map(el => this.flattenObject(el));
  }

}
