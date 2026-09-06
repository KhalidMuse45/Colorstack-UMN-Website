import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'chapterEmail', type: 'string', initialValue: 'colorstk@umn.edu' }),
    defineField({ name: 'mailingListUrl', type: 'url', description: 'Logicform endpoint. Hero, nav, form and closer all post here.' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'linkedin', type: 'url' }),
    defineField({ name: 'footerLine', type: 'string' }),
    defineField({ name: 'wunderbarWaitlistUrl', type: 'url', description: 'Waitlist for Wunderbar, the peer-to-peer mock interview platform. Shown on /wunderbar until it ships.' }),
    defineField({ name: 'chapterMark', type: 'image', description: 'Chapter mark only. Never the national mark.' }),
  ],
});
