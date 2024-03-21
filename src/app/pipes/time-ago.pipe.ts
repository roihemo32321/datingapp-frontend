import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    // If the value is not a Date object, create one
    if (!(value instanceof Date)) {
      value = new Date(value);
    }

    // Adjust for the timezone offset
    // The getTimezoneOffset() method returns the difference, in minutes, between UTC and local time.
    // Note that the value is positive if the local timezone is behind UTC and negative if it is ahead.
    const timezoneOffset = value.getTimezoneOffset() * 60000; // Convert offset to milliseconds

    // Create a new Date object adjusted for the timezone offset
    const adjustedDate = new Date(value.getTime() - timezoneOffset);

    // Use formatDistanceToNow to get the time difference in words based on the user's local time
    return formatDistanceToNow(adjustedDate, { addSuffix: true });
  }
}
