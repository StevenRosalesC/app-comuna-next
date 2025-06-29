'use client';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import Link from 'next/link';

interface Faq {
  question: string;
  answer: string;
  isOpen: boolean;
}

export default function FaqSection() {
  const faqs: Faq[] = [
    {
      question: '¿Cómo puedo participar en la comuna?',
      answer:
        'En el reglamento interno estipula que debe de estar en la primera asamblea pidiendo su afiliación bajo una solicitud y debe asistir a 5 asambleas consecutivas para otorgarle su afiliación.',
      isOpen: false
    },
    {
      question: '¿En que horarios puedo visitar la comuna?',
      answer:
        'Puede visitar la comuna en cualquier horario, pero se recomienda visitar en horarios de oficina.',
      isOpen: false
    }
  ];
  return (
    <section className='w-full py-4'>
      <div className='container grid gap-4 px-4 md:gap-6' data-aos='fade-up'>
        <div className='space-y-2'>
          <SubTitle className='text-center'>Preguntas Frecuentes</SubTitle>
          <Paragraph
            size={'sm'}
            className='text-gray-500 dark:text-gray-400 md:text-xl/relaxed'
          >
            ¿Tienes alguna pregunta? Encuentra respuestas o contacta con
            nosotros.
          </Paragraph>
        </div>
        <div data-aos='fade-up'>
          <Accordion type='single' collapsible>
            {faqs.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className='animate-fade-in-card'
              >
                <AccordionTrigger aria-expanded={item.isOpen}>
                  <h3 className='text-center text-xl sm:text-left'>
                    {item.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className='mt-4 text-center'>
          <span className='text-gray-600'>¿No encontraste tu respuesta?</span>{' '}
          <Link
            href='/contact'
            className='ml-1 font-semibold text-primary underline'
            aria-label='Ir a contacto'
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  );
}
