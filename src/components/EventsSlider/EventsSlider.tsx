import React, { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './EventsSlider.scss';
import slidernav from './slider-nav.svg';

type Event = {
  year: number;
  text: string;
};

interface EventsSliderProps {
  events: Event[];
}

const EventsSlider: React.FC<EventsSliderProps> = ({ events }) => {
  const [active, setActive] = useState('active');
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swiperRef.current) {
      // eslint-disable-next-line no-new
      new Swiper(swiperRef.current, {
        loop: false,
        modules: [Navigation, Pagination],
        slidesPerView: 2,
        spaceBetween: 10,
        breakpoints: {
          640: {
            slidesPerView: 3,
            spaceBetween: 10
          }
        },
        navigation: {
          enabled: true,
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }, []);

  useEffect(() => {
    setActive(''); 
    const timeout = setTimeout(() => {
      setActive('active');
    }, 10);
    return () => clearTimeout(timeout);
  }, [events]);

  return (
    <div className={`timeline-events ${active}`}>
      <img src={slidernav} className="swiper-button-next center-y" alt="Next" />
      <img src={slidernav} className="swiper-button-prev center-y" alt="Prev" />
      <div className='swiper' ref={swiperRef}>        
        <div className="swiper-wrapper">
          {events.map(event => (
            <div key={event.year} className="event-block swiper-slide">
              <h3 className="event-year">{event.year}</h3>
              <p className="event-text">{event.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsSlider;