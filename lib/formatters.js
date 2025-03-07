import { getLocale } from './options';
import { toFixed }   from './helpers';

/**
 * Get formatter instance
 * @param {String} locale ex: 'fr-FR'
 * @param {*} value
 * @param {Object} options
 *  options.maximumFractionDigits
 *  options.minimumFractionDigits
 * @returns {Intl}
 */
export function format (locale, value, options) {
  locale = getLocale(locale);

  value = value + '';

  let number            = value.split('.');
  let decimal           = number[0];
  let fraction          = number[1] || '';
  let thousandSeparator = locale.thousandSeparator || ' ';

  let thousandIterator = 0;
  let res              = '';

  if (fraction[fraction.length - 1] !== '0' && options.shouldNotRound !== true) {
    fraction = (toFixed(Number('0.' + fraction, 10), (options.maximumFractionDigits != null ? options.maximumFractionDigits : locale.precision)) + '');

    if (Number(fraction) === 1) {
      decimal = Number(decimal) + 1 + '';
    }

    fraction = fraction.slice(2);
  }

  for (let i = decimal.length - 1; i >= 0; i--) {
    res = decimal[i] + res;
    thousandIterator++;

    if (thousandIterator === 3 && i-1 >= 0) {
      res = thousandSeparator + res;
      thousandIterator = 0;
    }
  }

  if (options.minimumFractionDigits != null) {
    for (fraction+=''; fraction.length < options.minimumFractionDigits; fraction = fraction + '0') {}
  }

  if (options.shouldNotRound === true) {
    fraction = fraction.slice(0, options.maximumFractionDigits != null ? options.maximumFractionDigits : fraction.length);
  }

  if (fraction.length) {
    res += locale.decimalSeparator + fraction;
  }

  if (options.style === 'currency') {
    if (locale.isCurrencyFirst === true) {
      res = (options.unitPrefix || '') + locale.currencySymbol + res;
    }
    else {
      res += ' ' + (options.unitPrefix || '') + locale.currencySymbol;
    }
  }

  return res;
}
