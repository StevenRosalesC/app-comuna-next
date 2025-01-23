import React from 'react'
import { SubTitle } from '../ui/atoms/sub-title'
import { Paragraph } from '../ui/atoms/paragraph'
import { NoticeMiniCard } from '../notices/notice-mini-card'
import Slider from '../slider'



export const NoticesSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <SubTitle >
            Noticias recientes en la comunidad
          </SubTitle>
          <Paragraph size={'lg'}>
            Descubre las últimas noticias y eventos de la comunidad de Bambil Collao.
          </Paragraph>
        </div>
      </div>
      <Slider
        delay={5000}
      >
        {
          Array.from({ length: 5 }).map((_, index) => (
            <NoticeMiniCard key={index} />
          ))
        }

      </Slider>
    </section>
  )
}
