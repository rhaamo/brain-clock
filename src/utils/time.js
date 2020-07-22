import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

const secondsToDdHhMmSs = (seconds, locale = 'en') => {
    return moment.duration(seconds, 'seconds').locale(locale).format()
}

const formatShort = (date, locale = 'en') => {
    return moment(date).locale(locale).format('ddd D, HH:mm:ss')
}

const timeUtils = {
    secondsToDdHhMmSs,
    formatShort
}

export default timeUtils