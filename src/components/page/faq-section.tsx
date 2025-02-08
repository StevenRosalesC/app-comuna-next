'use client';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Faq {
  question: string;
  answer: string;
  isOpen: boolean;
}

export default function FaqSection() {
  const [faqs, setFaqs] = useState([
    {
      question: '¿Cómo puedo participar en la comuna?',
      answer: 'Yes. You can start or stop your plan at any time.',
      isOpen: false
    },
    {
      question: 'Can I switch plans?',
      answer: 'Yes. You can start or stop your plan at any time.',
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
  ]);
  return (
    <section className='w-full bg-white py-4'>
      <div className='container grid gap-4 px-4 md:gap-6'>
        <div className='space-y-2'>
          <SubTitle className='text-center'>Preguntas</SubTitle>
          <Paragraph
            size={'sm'}
            className='text-gray-500 dark:text-gray-400 md:text-xl/relaxed'
          >
            ¿Tienes alguna pregunta? Encuentra respuestas o contacta con
            nosotros.
          </Paragraph>
        </div>
        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <Collapsible
              key={index}
              className='grid border-t border-t-gray-200'
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant='unstyled'
                  className='w-full justify-between text-left font-semibold'
                  onClick={() => {
                    setFaqs(
                      faqs.map((item, i) => {
                        if (i === index) {
                          item.isOpen = !item.isOpen;
                        } else {
                          item.isOpen = false;
                        }
                        return item;
                      })
                    );
                  }}
                >
                  {faq.question}
                  <ChevronDown
                    className={`transform ${
                      faq.isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent
                asChild
                className='transition-all duration-300 ease-in-out'
              >
                <p className='text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-base'>
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}
