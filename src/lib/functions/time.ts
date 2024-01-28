import dayjs from 'dayjs';
import 'dayjs/locale/de';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Turns a number of miliseconds into a string to display that length of time
 */
export const getTimeSpan = (
    time: number,
    locale: string,
    withSuffix = true,
) => {
    return dayjs
        .duration({ milliseconds: time })
        .locale(locale)
        .humanize(withSuffix);
};
