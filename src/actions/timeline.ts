import type { UserTimelineV1Paginator } from 'twitter-api-v2';
import Client from '../client';

export default function (username: string) {
  try {
    return Client.instance.v1.userTimelineByUsername(username, Client.config.timeline);
  } catch {
    return { data: null } as UserTimelineV1Paginator;
  }
}