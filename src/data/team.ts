import zijun from '@/assets/team/zijun.jpg';
import james from '@/assets/team/james.jpg';
import ewan from '@/assets/team/ewan.jpg';
import theodore from '@/assets/team/theodore.jpg';
import aaron from '@/assets/team/aaron.jpg';
import llewis from '@/assets/team/llewis.jpg';
import owen from '@/assets/team/owen.jpg';

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

export const TEAM: readonly TeamMember[] = [
  { name: 'Zijun', role: 'Computer Engineering & Applications', photo: zijun },
  { name: 'James', role: 'Computer Engineering, ML/AI', photo: james },
  { name: 'Ewan', role: 'Co-founder · Research Engineer, NSYSU', base: 'Kaohsiung', photo: ewan },
  { name: 'Theodore', role: 'Mechatronics & Robotics', photo: theodore },
  { name: 'Aaron', role: 'Co-founder · Computer Science & Application Development', photo: aaron },
  { name: 'Llewis', role: 'Embedded Systems Engineer', photo: llewis },
  { name: 'Owen', role: 'Marine Engineer', photo: owen },
];
