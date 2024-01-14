import i18next from "i18next";

export default function getLanguages() {
    return [
        {
            code: "bg",
            flagCode: 'bg',
            name: "Български",
        },
        {
            code: "en",
            flagCode: 'us',
            name: "English",
        }
    ];
};

export function translateStatus(status) {

    switch (status) {
        case 'PENDING': return i18next.t('pendingStatus');
        case 'ACCEPTED': return i18next.t('acceptedStatus');
        case 'TRAVELLING': return i18next.t('travellingStatus');
        case 'CANCELED': return i18next.t('canceledStatus');
        default: return status;
    }
}

export function translateDayOfWeek(day) 
{  
    switch (day) {
        case 'MONDAY': return i18next.t('monday');
        case 'TUESDAY': return i18next.t('tuesday');
        case 'WEDNESDAY': return i18next.t('wednesday');
        case 'THURSDAY': return i18next.t('thursday');
        case 'FRIDAY': return i18next.t('friday');
        case 'SATURDAY': return i18next.t('saturday');
        case 'SUNDAY': return i18next.t('sunday');
        case undefined: return undefined;
        case null: return undefined;
        default: throw new Error('We dont have this day!');
    }
}