import { defineField, defineType } from 'sanity';
import { houseStyle } from './validation';

export default defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'text', rows: 4, validation: (r) => houseStyle(r.required()) }),
    defineField({ name: 'photo', type: 'reference', to: [{ type: 'chapterPhoto' }], validation: (r) => r.required() }),
    defineField({ name: 'pullQuote', type: 'string', description: 'Optional. Shown between programs in Lora italic.', validation: houseStyle }),
    defineField({ name: 'order', type: 'number', validation: (r) => r.required().integer().min(0) }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'order', media: 'photo.image' } },
});
