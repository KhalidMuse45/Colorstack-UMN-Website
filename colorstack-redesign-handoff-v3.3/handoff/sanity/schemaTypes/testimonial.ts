import { defineField, defineType } from 'sanity';
import { houseStyle } from './validation';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', description: 'e.g. Junior, CS. Or: Alum, SWE at ...', validation: houseStyle }),
    defineField({ name: 'photo', type: 'reference', to: [{ type: 'chapterPhoto' }] }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
});
