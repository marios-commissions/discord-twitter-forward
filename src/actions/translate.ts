import { translate } from '@vitalets/google-translate-api';

export default function (text: string, from: string = 'auto') {
  if (['en-US', 'en', 'en-GB'].includes(from)) {
    return { text, raw: { confidence: 1 } };
  }

  try {
    return translate(text, { from, to: 'en-US' });
  } catch {
    return { text: null, raw: null };
  }
}