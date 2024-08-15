import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate',
})
export class TimestampToDatePipe implements PipeTransform {
  transform(
    value: firebase.default.firestore.Timestamp | null | undefined,
  ): Date | null {
    if (value) {
      return value.toDate();
    }
    return null;
  }
}
