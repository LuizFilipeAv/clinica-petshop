import { Children, isValidElement, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from 'react';

type Props<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'children'>;

/**
 * Renders a heading whose words rise from a mask when it scrolls into view
 * (styles in globals.css: .split-word / [data-split]). Server-safe: the split is
 * done at render time, so there is no DOM mutation and no hydration mismatch.
 * Children may mix strings and inline elements (e.g. <em>); elements stay whole words.
 */
export default function SplitText<T extends ElementType = 'h2'>({ as, children, ...rest }: Props<T>) {
  const Tag = (as ?? 'h2') as ElementType;
  let w = 0;
  const label: string[] = [];

  const word = (content: ReactNode, key: string) => (
    <span className="split-word" key={key} aria-hidden="true">
      <span style={{ ['--w' as string]: w++ }}>{content}</span>
    </span>
  );

  const out: ReactNode[] = [];
  Children.toArray(children).forEach((child, ci) => {
    if (typeof child === 'string' || typeof child === 'number') {
      String(child).split(/(\s+)/).forEach((part, pi) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { out.push(' '); label.push(' '); return; }
        out.push(word(part, `${ci}-${pi}`));
        label.push(part);
      });
    } else if (isValidElement(child)) {
      out.push(word(child, `${ci}-el`));
      const inner = (child.props as { children?: ReactNode }).children;
      label.push(typeof inner === 'string' ? inner : '');
    }
  });

  return (
    <Tag data-split="" aria-label={label.join('').replace(/\s+/g, ' ').trim()} {...rest}>
      {out}
    </Tag>
  );
}
