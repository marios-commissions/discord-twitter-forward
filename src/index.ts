require('dotenv').config();

import Webhook from './webhook';
import Client from './client';

import config from '../config.json';

Client.connect();

const webhook = new Webhook(config.errors?.webhook);

process.on('uncaughtException', (error, origin) => {
	if (config.errors.catch) {
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
	};

	process.exit(1);
});
