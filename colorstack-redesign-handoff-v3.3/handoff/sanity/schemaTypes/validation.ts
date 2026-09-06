import type { Rule } from 'sanity';

/** "ColorStack" casing and no em dashes, applied to every string field. */
export const houseStyle = (rule: Rule) =>
  rule.custom((value?: string) => {
    if (!value) return true;
    if (/color ?stack/i.test(value) && !value.includes('ColorStack')) {
      return 'Write "ColorStack" with a capital C and a capital S.';
    }
    if (value.includes('\u2014')) {
      return 'No em dashes in copy. Use a comma or a full stop.';
    }
    return true;
  });
