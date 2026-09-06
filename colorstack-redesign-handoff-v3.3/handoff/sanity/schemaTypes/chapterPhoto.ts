import { defineField, defineType } from 'sanity';
import { houseStyle } from './validation';

export default defineType({
  name: 'chapterPhoto',
  title: 'Chapter photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'A full sentence describing what is actually in the frame.',
      validation: (r) => houseStyle(r.required().min(20)),
    }),
    defineField({ name: 'event', type: 'string', validation: houseStyle }),
    defineField({ name: 'takenAt', type: 'date' }),
    defineField({
      name: 'caption',
      title: 'Fig. caption',
      type: 'string',
      description: 'Shown as "Fig. 0N — caption" under full-bleed photos.',
      validation: houseStyle,
    }),
  ],
  preview: { select: { title: 'event', subtitle: 'takenAt', media: 'image' } },
});
