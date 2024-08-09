import { differenceInDays } from 'date-fns';

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function renderDate(item, column) {
  let value = item[column.field];
  if (!value) {
    return '';
  }
  if (!(value instanceof Date)) {
    value = new Date(value);
  }
  return formatDate(value);
}

//get the difference in days between two dates using date-fns
export function getDifferenceInDays(date1, date2) {
  return Math.abs(differenceInDays(date1, date2));
}

export class Utils {
  static BASE_PATH = '/auditoria-medica/';
}
