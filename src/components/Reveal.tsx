import { useInView } from '@/hooks/useInView';

/** Fades a block in once it scrolls into view, like the home page sections. */
export default function Reveal({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  return <div ref={ref} id={id} className={`${className} armed${inView ? ' in' : ''}`.trim()}>{children}</div>;
}
