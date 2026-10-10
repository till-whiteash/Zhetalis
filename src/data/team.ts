/**
 * People shown on the About page. The "Who you'll work with" section stays hidden while this list is empty.
 *
 * To add someone, copy the example below out of the comment. `photo` is optional: put the image in
 * src/assets/ and import it at the top of this file, e.g.  import mei from '@/assets/team-mei.jpg';
 * Roles and bios are plain text; if you want them translated, ask and they can move into translations.ts.
 *
 *   {
 *     name: 'Mei Lin',
 *     role: 'Founder, Systems Design',
 *     base: 'Kaohsiung',
 *     bio: 'Fifteen years designing data platforms for logistics companies.',
 *     photo: mei,
 *     linkedin: 'https://www.linkedin.com/in/…',
 *   },
 */
export interface TeamMember {
  name: string;
  role: string;
  base?: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
}

export const TEAM: readonly TeamMember[] = [];
