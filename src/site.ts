/**
 * Single place to edit everything that identifies this portfolio.
 * Change it here and it updates across every page.
 */
export const site = {
  author: 'Lars Herrmann',
  title: 'AP English Portfolio',
  year: 'Year 2',
  school: 'Technische Berufsschule Zürich',
  schoolShort: 'TBZ Zürich',
  course: 'ICT English',
  teacher: 'Joseph Heeg',

  /**
   * The school year this portfolio covers. The Year Spine on the home page
   * draws one slot per month between these two dates, so it always shows
   * which months still need an entry.
   */
  schoolYear: {
    start: '2026-08-01',
    end: '2027-07-31',
    label: '2026 / 2027',
  },

  nav: [
    { href: '/', label: 'Entries' },
    { href: '/about/', label: 'About' },
  ],
} as const;
