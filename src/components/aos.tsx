'use client';

import { useEffect } from 'react';
import 'aos/dist/aos.css';

interface Props {
  duration?: number;
}

export default function Aos({ duration = 1000 }: Props) {
  useEffect(() => {
    import('aos').then((AOS) =>
      AOS.init({
        duration: duration
      })
    );
  }, [duration]);

  return <></>;
}
