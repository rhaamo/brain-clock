import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

function extractLocale (locale) {
    return  locale.split("-")[0].toLowerCase()
}

const secondsToDdHhMmSs = (seconds, locale = 'en') => {
    return moment.duration(seconds, 'seconds').locale(extractLocale(locale)).format()
}

const formatShort = (date, locale = 'en') => {
    return moment(date).locale(extractLocale(locale)).format('ddd D, HH:mm:ss')
}

const timeUtils = {
    secondsToDdHhMmSs,
    formatShort
}

export default timeUtils