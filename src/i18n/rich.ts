export interface RichSegment {
  text: string;
  em?: true;
}

export function parseRich(raw: string): RichSegment[] {
  const out: RichSegment[] = [];
  const re = /\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) out.push({ text: raw.slice(last, m.index) });
    out.push({ text: m[1]!, em: true });
    last = re.lastIndex;
  }
  if (last < raw.length) out.push({ text: raw.slice(last) });
  return out;
}

/** Same as parseRich, but splits each segment into word/space units so each can be animated. */
export function parseRichWords(raw: string, splitCharacters = false): { text: string; em?: true; space: boolean }[] {
  return parseRich(raw).flatMap((seg) =>
    (splitCharacters ? Array.from(seg.text) : seg.text.split(/(\s+)/))
      .filter((s) => s.length > 0)
      .map((s) => ({
        text: s,
        em: seg.em,
        space: /^\s+$/.test(s),
      }))
  );
}
