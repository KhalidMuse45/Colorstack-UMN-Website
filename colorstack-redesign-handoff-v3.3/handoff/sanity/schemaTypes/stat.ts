import { defineField, defineType } from 'sanity';

/** A stat ships only when someone has put their name on it. */
export default defineType({
  name: 'stat',
  title: 'Stat',
  type: 'document',
  fields: [
    defineField({ name: 'value', type: 'string', description: 'e.g. 100+', validation: (r) => r.required() }),
    defineField({ name: 'label', type: 'string', description: 'e.g. Members', validation: (r) => r.required() }),
    defineField({ name: 'confirmedBy', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'confirmedOn', type: 'date', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
});
