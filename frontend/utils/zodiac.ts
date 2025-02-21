export const zodiacSigns = [
    { sign: "Capricorn", start: "12-22", end: "01-19" },
    { sign: "Aquarius", start: "01-20", end: "02-18" },
    { sign: "Pisces", start: "02-19", end: "03-20" },
    { sign: "Aries", start: "03-21", end: "04-19" },
    { sign: "Taurus", start: "04-20", end: "05-20" },
    { sign: "Gemini", start: "05-21", end: "06-20" },
    { sign: "Cancer", start: "06-21", end: "07-22" },
    { sign: "Leo", start: "07-23", end: "08-22" },
    { sign: "Virgo", start: "08-23", end: "09-22" },
    { sign: "Libra", start: "09-23", end: "10-22" },
    { sign: "Scorpio", start: "10-23", end: "11-21" },
    { sign: "Sagittarius", start: "11-22", end: "12-21" }
];

export const getZodiacSign = (date: string): string | null => {
    const [, month, day] = date.split("-").map(Number);

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedDate = `${formattedMonth}-${formattedDay}`;

    for (const { sign, start, end } of zodiacSigns) {
        if (sign === "Capricorn") {
            if (formattedDate >= start || formattedDate <= end) {
                return sign;
            }
            continue;
        }

        if (formattedDate >= start && formattedDate <= end) {
            return sign;
        }
    }
    return null;
};