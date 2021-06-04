import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertFeePaid'
})
export class ConvertFeePaidPipe implements PipeTransform {

    transform(value: any): any {
        if (typeof value === 'undefined' || value === null) {
            return 'false';
        }

        return value;
    }

}