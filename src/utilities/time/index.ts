import moment from 'moment-timezone';

export const currentTimestamp = (): string =>
  moment().format('YYYY-MM-DD HH:mm:ss.SSSSSSSSS').toString();
