'use client';

import { useEffect } from 'react';
import 'aos/dist/aos.css';

export default function Aos() {
  useEffect(() => {
    import('aos').then((AOS) =>
      AOS.init({
        duration: 1200,
      })
    );
  }, []);

  return <></>;
}
