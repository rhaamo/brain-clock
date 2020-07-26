import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment)

function extractLocale (locale) {
    return  locale.split("-")[0].toLowerCase()
}

const secondsToDdHhMmSs = (seconds, locale = 'en') => {
    return moment.duration(seconds, 'seconds').locale(extractLocale(locale)).format()
}

const secondsToHhMmSs = (seconds, locale = 'en') => {
    return moment.duration(seconds, 'seconds').locale(extractLocale(locale)).format('hh:mm:ss')
}


const formatShort = (date, locale = 'en', format = 'ddd D') => {
    return moment(date).locale(extractLocale(locale)).format(format)
}

const format = (date, locale = 'en', format = 'hh:mm:ss') => {
    return moment(date).locale(extractLocale(locale)).format(format)
}

const deltaHms = (from, to) => {
    let t1 = moment(from, 'hh:mm:ss')
    let t2 = moment(to, 'hh:mm:ss')
    return t2.diff(t1, 'seconds')
}

const fromSupTo = (from, to) => {
    let t1 = moment(from, 'hh:mm:ss')
    let t2 = moment(to, 'hh:mm:ss')
    return t1 > t2
}

const timeUtils = {
    secondsToDdHhMmSs,
    formatShort,
    deltaHms,
    fromSupTo,
    secondsToHhMmSs,
    format
}

export default timeUtils