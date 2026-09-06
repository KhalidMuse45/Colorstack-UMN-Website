import { groq } from 'next-sanity';
import { client, urlFor } from './client';

const photo = `{
  "src": image.asset->url,
  "width": image.asset->metadata.dimensions.width,
  "height": image.asset->metadata.dimensions.height,
  alt, event, caption
}`;

export const landingQuery = groq`*[_type == "landingPage"][0]{
  heroWordmark, heroLede, heroPrimaryCta,
  "heroPhoto": heroPhoto->${photo},
  missionHeadline, missionBody, missionRotatorPrefix, missionRotator,
  programsHeadline,
  "programs": programs[]->{ title, body, pullQuote, order, "photo": photo->${photo} } | order(order asc),
  "stats": stats[]->[defined(confirmedOn)]{ value, label, confirmedOn },
  statsAside,
  communityHeadline, communityBody,
  "communityRoll": communityRoll[]->${photo},
  roomHeadline, marginalia,
  "roomGrid": roomGrid[]->${photo},
  "testimonials": testimonials[]->{ quote, name, role },
  "deckPhotos": deckPhotos[]->${photo},
  "mailingListUrl": *[_type == "siteSettings"][0].mailingListUrl
}`;

export type Photo = { src: string; alt: string; width: number; height: number; event?: string; caption?: string };

export type Landing = {
  heroWordmark: string; heroLede: string;
  heroPrimaryCta: string; heroPhoto: Photo;
  missionHeadline: string; missionBody: string[]; missionRotatorPrefix: string; missionRotator: string[];
  programsHeadline: string;
  programs: { title: string; body: string; pullQuote?: string; order: number; photo: Photo }[];
  stats: { value: string; label: string; confirmedOn: string }[];
  statsAside?: string;
  communityHeadline: string; communityBody: string[]; communityRoll: Photo[];
  roomHeadline: string; marginalia?: string; roomGrid: Photo[];
  testimonials: { quote: string; name: string; role?: string }[];
  deckPhotos: Photo[];
  mailingListUrl: string;
};

export async function getLanding(): Promise<Landing> {
  return client.fetch<Landing>(landingQuery, {}, { next: { revalidate: 60, tags: ['landing'] } });
}

export { urlFor };
