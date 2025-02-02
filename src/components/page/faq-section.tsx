/**
 * v0 by Vercel.
 * @see https://v0.dev/t/OdDS93vquhe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { SubTitle } from '../ui/atoms/sub-title';
import { Paragraph } from '../ui/atoms/paragraph';

export default function FaqSection() {
  return (
    <section className='w-full bg-white py-4'>
      <div className='container grid gap-4 px-4 md:gap-6'>
        <div className='space-y-2'>
          <SubTitle className='text-center'>Preguntas frecuentes</SubTitle>
          <Paragraph className='text-gray-500 dark:text-gray-400 md:text-xl/relaxed'>
            ¿Tienes alguna pregunta? Encuentra respuestas o contacta con
            nosotros.
          </Paragraph>
        </div>
        <div className='space-y-4'>
          <Collapsible className='grid'>
            <CollapsibleTrigger asChild>
              <Button
                variant='unstyled'
                className='w-full justify-start text-left font-semibold'
              >

                  ¿Cómo puedo participar en la comuna?
            <CollapsibleContent asChild>
              <p className='text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-base'>
                Yes. You can start or stop your plan at any time.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className='grid'>
            <CollapsibleTrigger asChild>
              <Button
                variant='unstyled'
                className='w-full justify-start text-left font-semibold'
              >
                Can I switch plans?
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <p className='text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-base'>
                Yes. You can start or stop your plan at any time.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className='grid'>
            <CollapsibleTrigger asChild>
              <Button
                variant='unstyled'
                className='w-full justify-start text-left font-semibold'
              >
                Do you offer a discount for non-profit
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <p className='text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-base'>
                Yes. You can start or stop your plan at any time.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className='grid'>
            <CollapsibleTrigger asChild>
              <Button
                variant='unstyled'
                className='w-full justify-start text-left font-semibold'
              >
                How secure is your service?
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <p className='text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-base'>
                Yes. You can start or stop your plan at any time.
              </p>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible className='grid'>
            <CollapsibleTrigger asChild>
              <Button
                variant='unstyled'
                className='w-full justify-start text-left font-semibold'
              >
                Can I cancel at any time?
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <p className='text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-base'>
                Yes. You can start or stop your plan at any time.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </section>
  );
}
