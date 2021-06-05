import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertID'
})
export class ConvertIDPipe implements PipeTransform {

    transform(id: string): string {
        id = id.toUpperCase().slice(3);

        return id;
    }

}