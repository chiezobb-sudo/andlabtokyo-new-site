import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export type Course = {
  id: string;
  title: string;
  description: string;
  price: string;
  schedule: string;
  heroImage?: { url: string };
};
