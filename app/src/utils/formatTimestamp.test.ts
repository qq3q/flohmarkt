// formatTimestamp.test.ts
import {formatTimestamp} from './formatTimestamp';

describe('utils/formatTimestamp', () => {
   it('should return only the time when the date is today', () => {
      const today = new Date();
      const todayString = today.toISOString();
      const result = formatTimestamp(todayString);

      const expectedTime = today.toLocaleTimeString('de-DE', {
         hour:   '2-digit',
         minute: '2-digit',
         second: '2-digit',
      });

      expect(result).toBe(expectedTime);
   });

   it('should return formatted date and time for a past date', () => {
      const dateString = '2023-01-01T10:30:00.000Z';
      const result = formatTimestamp(dateString);

      const expectedDateTime = new Intl.DateTimeFormat('de-DE', {
         dateStyle: 'short',
         timeStyle: 'medium',
      }).format(new Date(dateString));

      expect(result).toBe(expectedDateTime);
   });

   it('should handle invalid date input gracefully', () => {
      const invalidDateString = 'invalid-date-string';

      expect(() => formatTimestamp(invalidDateString)).toThrowError();
   });
});