export const formatTimestamp = (dateString: string)=> {
   const date = new Date(dateString);
   const today = new Date();

   // Prüfen, ob das Datum heute ist
   const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

   if (isToday) {
      // Gibt nur die Uhrzeit zurück
      return date.toLocaleTimeString('de-DE', {
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
      });
   } else {
      // Gibt das Datum und die Uhrzeit im deutschen Format zurück
      return new Intl.DateTimeFormat('de-DE', {
         dateStyle: 'short',
         timeStyle: 'medium',
      }).format(date);
   }
}
