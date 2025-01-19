import { API_URL } from '@/lib/env.config';
import { FetchInstance } from '@/lib/fetchInstance';

const jiraApi = new FetchInstance(API_URL, {
  // next:{revalidate:60},
  cache: 'no-store'
});

export default jiraApi;
