import { useEffect, useState, useMemo } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
  node: Element;
}

interface UseTocOptions {
  containerSelector: string;
  headingSelector?: string;
  observerOptions?: IntersectionObserverInit;
}

export default function useToc(options: UseTocOptions) {
  const {
    containerSelector,
    headingSelector = 'h2, h3, h4',
    observerOptions
  } = options;

  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const memoizedObserverOptions = useMemo(
    () => observerOptions,
    [observerOptions]
  );

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const headings = container.querySelectorAll(headingSelector);

    const newItems = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName[1]),
      node: heading
    }));

    // Solo actualiza si hay cambios
    setItems((prevItems) => {
      const isEqual =
        prevItems.length === newItems.length &&
        prevItems.every((item, index) => item.id === newItems[index].id);
      return isEqual ? prevItems : newItems;
    });
  }, [containerSelector, headingSelector]);

  useEffect(() => {
    if (!items.length) return;

    const elements = items.map((item) => item.node);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, memoizedObserverOptions);

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [items, memoizedObserverOptions]);

  return { items, activeId };
}
