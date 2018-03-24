/**
   * Convert integer time to hh:mm format
   * @param {integer} dateTime - time in integer format
   * @returns {string} - time in hh:mm format 
   */
export const getClock = dateTime => {
  const time = new Date( dateTime );
  if ( isNaN( time ) ) {
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
export const getTimeString = dateTime => {
  const minutes = Math.floor( dateTime / 1000 / 60 );

  let h = Math.floor( minutes / 60 );
  let m = minutes - h * 60;
  h = isNaN( h ) ? '- ' : h;
  m = isNaN( m ) ? '-' : m;
  if ( h ===0 ) {
    return '' + m;
  }
  return `${h}:${m}`;
};

/**
 * Show toast with some message
 * @param {string} message - user message for toast
 */
export const showToast = ( message ) => {
  window.plugins.toast.showWithOptions({
    message: message,
    duration: "3000", 
    position: "center",
    styling: {
      opacity: 0.75, 
      textColor: '#FFFF00', 
      textSize: 26.5, 
      cornerRadius: 16, 
    }
  });
}
