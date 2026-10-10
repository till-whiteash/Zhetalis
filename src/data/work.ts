import storeflowPitch from '@/assets/work/storeflow-pitch.jpg';
import storeflowArch from '@/assets/work/storeflow-architecture.jpg';
import storeflowFront from '@/assets/work/storeflow-front.jpg';
import storeflowBack from '@/assets/work/storeflow-back.jpg';
import shifaJourney from '@/assets/work/shifa-journey.jpg';
import shifaArch from '@/assets/work/shifa-architecture.jpg';
import shifaArabic from '@/assets/work/shifa-arabic.jpg';

export interface Shot {
  src: string;
  w: number;
  h: number;
  /** translation key for the caption */
  cap: string;
  /** 'screen' sits on a tinted plate, cropped at the bottom edge like a window */
  kind?: 'photo' | 'screen' | 'diagram';
}

export interface Result {
  /** a figure that reads the same in every language, e.g. "~95%". Leave out for a plain sentence. */
  fig?: string;
  /** or a translation key, for a figure that needs words */
  figKey?: string;
  /** translation key: the line under the figure, or the whole sentence when there is no figure */
  text: string;
  /** from the cost model, not demonstrated */
  projected?: boolean;
}

export interface Project {
  id: string;
  /** product names are not translated */
  name: string;
  /** prefix for its translation keys, e.g. 'wk.sf' */
  k: string;
  year: string;
  cover: Shot;
  diagram: Shot;
  gallery: Shot[];
  /** heading key and step keys for the walkthrough */
  flowTitle: string;
  flow: string[];
  safety?: string;
  design?: string[];
  results: Result[];
  stack: string[];
  code?: string;
}

/*
 * Case studies for /work. Text lives in src/i18n/translations.ts under wk.*.
 * Keep projected figures marked: they come from the cost model, not from a running system.
 */
export const PROJECTS: Project[] = [
  {
    id: 'storeflow',
    name: 'StoreFlow',
    k: 'wk.sf',
    year: '2026',
    cover: { src: storeflowPitch, w: 1320, h: 742, cap: 'wk.sf.c.pitch', kind: 'photo' },
    diagram: { src: storeflowArch, w: 1400, h: 777, cap: 'wk.sf.c.arch', kind: 'diagram' },
    gallery: [
      { src: storeflowFront, w: 587, h: 367, cap: 'wk.sf.c.front' },
      { src: storeflowBack, w: 684, h: 427, cap: 'wk.sf.c.back' },
    ],
    flowTitle: 'wk.flow',
    flow: ['wk.sf.s0', 'wk.sf.s1', 'wk.sf.s2', 'wk.sf.s3', 'wk.sf.s4', 'wk.sf.s5'],
    results: [
      { fig: 'SGD 318', text: 'wk.sf.r0.t' },
      { text: 'wk.sf.r1.t' },
      { fig: '~50%', text: 'wk.sf.r2.t', projected: true },
      { fig: '~95%', text: 'wk.sf.r3.t', projected: true },
      { fig: '~95%', text: 'wk.sf.r4.t', projected: true },
      { figKey: 'wk.sf.r5.f', text: 'wk.sf.r5.t', projected: true },
    ],
    stack: ['Raspberry Pi', 'YOLO', 'Custom CNN', 'Load cells', 'RFID', 'SQL'],
  },
  {
    id: 'shifa',
    name: 'Shifa',
    k: 'wk.sh',
    year: '2026',
    cover: { src: shifaJourney, w: 1440, h: 863, cap: 'wk.sh.c.journey', kind: 'screen' },
    diagram: { src: shifaArch, w: 1600, h: 827, cap: 'wk.sh.c.arch', kind: 'diagram' },
    gallery: [
      { src: shifaArabic, w: 1440, h: 615, cap: 'wk.sh.c.arabic', kind: 'screen' },
    ],
    flowTitle: 'wk.flowSh',
    flow: ['wk.sh.s0', 'wk.sh.s1', 'wk.sh.s2', 'wk.sh.s3', 'wk.sh.s4', 'wk.sh.s5'],
    safety: 'wk.sh.safety',
    design: ['wk.sh.d0', 'wk.sh.d1', 'wk.sh.d2', 'wk.sh.d3'],
    results: [
      { fig: '17/18', text: 'wk.sh.r0.t' },
      { text: 'wk.sh.r1.t' },
      { text: 'wk.sh.r2.t' },
    ],
    stack: ['AWS Lambda', 'Bedrock AgentCore', 'Claude Sonnet 5', 'Claude Haiku 4.5', 'Bedrock Guardrails', 'DynamoDB', 'Twilio', 'Next.js'],
    code: 'https://github.com/manav2701/Team9Aws',
  },
];
