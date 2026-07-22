export type DateLocale = {
  monthNames: string[];
  shortMonthNames: string[];
  weekdays: string[];
  years: string;
  months: string;
  age: string;
  datePickerTitle: string;
};

export const dateLocales: Record<string, DateLocale> = {
  en: {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    shortMonthNames: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    years: 'yrs',
    months: 'mos',
    age: 'Age',
    datePickerTitle: 'Select Date of Birth',
  },
  gu: {
    monthNames: [
      'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
      'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર',
    ],
    shortMonthNames: [
      'જાન્યુ', 'ફેબ્રુ', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
      'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટે', 'ઓક્ટો', 'નવે', 'ડિસે',
    ],
    weekdays: ['ર', 'સો', 'મં', 'બુ', 'ગુ', 'શુ', 'શ'],
    years: 'વર્ષ',
    months: 'મહિના',
    age: 'વય',
    datePickerTitle: 'જન્મ તારીખ પસંદ કરો',
  },
  hi: {
    monthNames: [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
    ],
    shortMonthNames: [
      'जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितं', 'अक्टू', 'नवे', 'दिसे',
    ],
    weekdays: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
    years: 'साल',
    months: 'महीने',
    age: 'उम्र',
    datePickerTitle: 'जन्म तिथि चुनें',
  },
  kn: {
    monthNames: [
      'ಜನವರಿ', 'ಫೆಬ್ರುವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್',
      'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್',
    ],
    shortMonthNames: [
      'ಜನ', 'ಫೆಬ್ರ', 'ಮಾರ್', 'ಏಪ್ರಿ', 'ಮೇ', 'ಜೂನ್',
      'ಜುಲೈ', 'ಆಗ', 'ಸೆಪ್ಟೆ', 'ಅಕ್ಟೋ', 'ನವೆ', 'ಡಿಸೆ',
    ],
    weekdays: ['ಭಾ', 'ಸೋ', 'ಮಂ', 'ಬು', 'ಗು', 'ಶು', 'ಶನಿ'],
    years: 'ವರ್ಷಗಳು',
    months: 'ತಿಂಗಳುಗಳು',
    age: 'ವಯಸ್ಸು',
    datePickerTitle: 'ಹುಟ್ಟಿದ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  },
};
