import translate from './actions/translate';
import timeline from './actions/timeline';
import client from './client';
import moment from 'moment';

export default class Interval {
  public seen = new Set();
  public timeout: number;

  constructor() {
    this.loop();
  }

  async loop() {
    if (this.timeout && (this.timeout - moment().unix() > 0)) {
      const ms = (this.timeout - moment().unix()) * 100;
      console.log(`Waiting ${ms}ms for timeout to expire...`);
      await new Promise(r => setTimeout(r, ms));
    }

    this.check();
  }

  async check() {
    const timeout = moment();

    timeout.add(client.config.delay, 'milliseconds');

    this.timeout = timeout.unix();

    for (const account of client.config.accounts) {
      console.log(`Checking account ${account}...`);
      const { data } = await timeline(account);
      if (!data) continue;

      for (const tweet of data.filter(e => new Date(e.created_at) > client.started)) {
        if (this.seen.has(tweet.id)) continue;
        this.seen.add(tweet.id);

        const { text, raw } = await translate(tweet.full_text);

        await fetch(client.config.webhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: [
              raw ? `**Translated with ${raw.confidence * 100}% confidence**` : 'Failed to translate due to ratelimit',
              '',
              text ?? tweet.full_text,
              `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
            ].join('\n')
          })
        });
      }

      console.log(`Finished checking account ${account}.`);
    }

    this.loop();
  }
};