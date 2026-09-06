import { defineField, defineType } from 'sanity';
import { houseStyle } from './validation';

const ref = (to: string) => ({ type: 'reference', to: [{ type: to }] });

export default defineType({
  name: 'landingPage',
  title: 'Landing page',
  type: 'document',
  groups: [
    { name: 'hero', title: '№ 00 Hero' },
    { name: 'mission', title: '№ 01 Mission' },
    { name: 'programs', title: '№ 02 What we do' },
    { name: 'stats', title: 'Spec sheet' },
    { name: 'community', title: '№ 03 Who we show up for' },
    { name: 'room', title: '№ 04 In the room' },
    { name: 'contact', title: '№ 06 Get in touch' },
  ],
  fields: [
    defineField({ name: 'heroWordmark', type: 'string', group: 'hero', initialValue: 'ColorStack UMN' }),
    defineField({ name: 'heroLede', type: 'text', rows: 3, group: 'hero', validation: houseStyle }),
    defineField({ name: 'heroPhoto', ...ref('chapterPhoto'), group: 'hero', validation: (r) => r.required() }),
    defineField({ name: 'heroPrimaryCta', type: 'string', group: 'hero', initialValue: 'Join the List' }),

    defineField({ name: 'missionHeadline', type: 'string', group: 'mission', validation: houseStyle }),
    defineField({ name: 'missionBody', type: 'array', of: [{ type: 'text' }], group: 'mission' }),
    defineField({ name: 'missionRotatorPrefix', type: 'string', group: 'mission', initialValue: 'Building a space for' }),
    defineField({
      name: 'missionRotator',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'mission',
      description: 'Ends on "you." Keep it last.',
    }),

    defineField({ name: 'programsHeadline', type: 'string', group: 'programs', validation: houseStyle }),
    defineField({ name: 'programs', type: 'array', of: [ref('program')], group: 'programs' }),

    defineField({ name: 'stats', type: 'array', of: [ref('stat')], group: 'stats' }),
    defineField({ name: 'statsAside', type: 'text', rows: 3, group: 'stats', validation: houseStyle }),

    defineField({ name: 'communityHeadline', type: 'string', group: 'community', validation: houseStyle }),
    defineField({ name: 'communityBody', type: 'array', of: [{ type: 'text' }], group: 'community' }),
    defineField({ name: 'communityRoll', type: 'array', of: [ref('chapterPhoto')], group: 'community' }),

    defineField({ name: 'roomHeadline', type: 'string', group: 'room', validation: houseStyle }),
    defineField({ name: 'roomGrid', type: 'array', of: [ref('chapterPhoto')], group: 'room', validation: (r) => r.max(4) }),
    defineField({ name: 'marginalia', type: 'string', group: 'room', description: 'One italic note in the gutter. Optional.', validation: houseStyle }),

    defineField({ name: 'testimonials', type: 'array', of: [ref('testimonial')], group: 'contact' }),
    defineField({ name: 'deckPhotos', type: 'array', of: [ref('chapterPhoto')], group: 'contact', validation: (r) => r.max(8) }),
  ],
  preview: { prepare: () => ({ title: 'Landing page' }) },
});
