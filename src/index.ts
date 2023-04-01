require('dotenv').config();

import Webhook from './webhook';
import Client from './client';

import config from '../config.json';

Client.connect();

if (config.errors.catch) {
  const webhook = new Webhook(config.errors.webhook);

  process.on('uncaughtException', (error, origin) => {
    webhook.send({
      content: [
        '**An error occured inside discord-twitter-forward**',
        '',
        `Origin: \`${origin ?? 'Unknown'}\``,
        `Cause: \`${error.cause ?? 'Unknown'}\``,
        `Type: \`${error.name}\``,
        `Stack: \`\`\`\n${error.stack}\n\`\`\``,
      ].join('\n')
    });
  });
}
