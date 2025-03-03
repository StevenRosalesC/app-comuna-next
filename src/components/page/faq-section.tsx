"use client";
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface Faq {
  question: string;
  answer: string;
  isOpen: boolean;
}

export default function FaqSection() {
  const faqs: Faq[] = [
    {
      question: '¿Cómo puedo participar en la comuna?',
      answer: 'En el reglamento interno estipula que debe de estar en la primera asamblea pidiendo su afiliación bajo una solicitud y debe asistir a 5 asambleas consecutivas para otorgarle su afiliación.',
      isOpen: false
    },
    {
      question: '¿En que horarios puedo visitar la comuna?',
      answer: 'Puede visitar la comuna en cualquier horario, pero se recomienda visitar en horarios de oficina.',
      isOpen: false
    },
    {
      question: 'Do you offer a discount for non-profit',
      answer: 'Yes. You can start or stop your plan at any time.',
      isOpen: false
    },
    {
      question: 'How secure is your service?',
      answer: 'Yes. You can start or stop your plan at any time.',
      isOpen: false
    },
    {
      question: 'Can I cancel at any time?',
      answer: 'Yes. You can start or stop your plan at any time.',
      isOpen: false
    }
  ]
  return (
    <section className='w-full  py-4'>
      <div className='container grid gap-4 px-4 md:gap-6' data-aos="fade-up">
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
        <div data-aos="fade-up">

          <Accordion type='single' collapsible>
            {
              faqs.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <h3 className='text-xl text-center sm:text-left'>{item.question}</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        </div>
      </div>
    </section>
  );
}
