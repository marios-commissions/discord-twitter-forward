import { CONSUMER_SECRET, CONSUMER_KEY } from './constants';
import { TwitterApi } from 'twitter-api-v2';
import { xauthLogin } from 'xauth-login';
import config from '../config.json';
import Interval from './interval';
import Webhook from './webhook';

class Client {
  public instance: InstanceType<typeof TwitterApi>;
  public webhook: InstanceType<typeof Webhook>;
  public config = config;
  public started: Date;

  async connect() {
    const { oauth_token, oauth_token_secret } = await xauthLogin({
      username: process.env.TWITTER_USERNAME,
      password: process.env.TWITTER_PASSWORD,
      appKey: CONSUMER_KEY,
      appSecret: CONSUMER_SECRET
    });

    this.instance = new TwitterApi({
      appKey: CONSUMER_KEY,
      appSecret: CONSUMER_SECRET,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret
    });

    this.webhook = new Webhook(config.webhook);
    this.started = new Date();

    new Interval();
  }
};

export default new Client();