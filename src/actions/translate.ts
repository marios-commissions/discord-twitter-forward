import { translate } from '@vitalets/google-translate-api';

export default function (text: string, from: string = 'auto') {
  return translate(text, { from, to: 'en-US' });
}