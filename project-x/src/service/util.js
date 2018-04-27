import moment from 'moment';

/**
   * Convert integer time to hh:mm format
   * @param {integer} dateTime - time in integer format
   * @returns {string} - time in hh:mm format
   */
export const getClock = (dateTime) => {
  const time = new Date(dateTime);
  if (isNaN(time)) {
    return '';
  }
  const timeString = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  return `${time.getHours()}:${timeString}`;
};

/**
   * Translate msec to time in format "h:m"
   * @param { number } dateTime -- time(in msec) in number format
   * @returns { string } time in h:m format
   */
export const getTimeString = (dateTime) => {
  const minutes = Math.floor(dateTime / 1000 / 60);

  let h = Math.floor(minutes / 60);
  let m = minutes - (h * 60);
  h = isNaN(h) ? '- ' : h;
  m = isNaN(m) ? '-' : m;
  if (h === 0) {
    return `${m}`;
  }
  return `${h}:${m}`;
};

/**
 * @param {[]} eventsArr -- array of events
 * @param {{}} event -- some event
 * @returns {[]} array of conflict events or empty array
 */
export const getConflictEvents = (eventsArr, event) => {
  const result = eventsArr.filter((e) => {
    const isStartInTheAnotherEvent = moment(event.start) >= moment(e.start)
                                    && moment(event.start) < moment(e.end);
    const isEndInTheAnotherEvent = moment(event.end) >= moment(e.start)
                                    && moment(event.end) < moment(e.end);
    const isEventCoverAnotherEvent = moment(e.start) >= moment(event.start)
                                     && moment(e.end) <= moment(event.end);
    return isStartInTheAnotherEvent || isEndInTheAnotherEvent || isEventCoverAnotherEvent;
  });
  return result;
};

/**
 * use: declOfNum(60, ['second', 'seconds', 'seconds']);
 */
export const declOfNum = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};
