import gsap from 'gsap';
import { useCallback, useEffect, useState } from 'react';
import EventsSlider from '../EventsSlider/EventsSlider';
import './YearsCircle.scss';
import timelinenav from './timeline-nav.svg';

// Представим что мы получаем события из API 
import events from './fakeApi';

type ShiftMatrixEntry = {
  rotate: number[];
  pos: [string, string][];
};

const ROTATION_DUR = 0.6;

const shiftMatrix: { [key: number]: ShiftMatrixEntry } = {
  2: { rotate: [0, -180], pos: [['8%', '8%'], ['80%', '80%']]},
  3: { rotate: [0, -95, -250], pos: [['8%', '8%'], ['87%', '18%'], ['28%', '92%']]},
  4: { rotate: [0, -90, -180, -270], pos: [['8%', '10%'], ['77%', '6%'], ['79%', '81%'], ['9%', '80%']]},
  5: { rotate: [0, -70, -140, -210, -280], pos: [['7%', '12%'], ['65%', '-1%'], ['94%', '38%'], ['72%', '86%'], ['15%', '85%']]},
  6: { rotate: [0, -60, -120, -180, -240, -300], pos: [['7%', '12%'], ['45%', '-6%'], ['85%', '15%'], ['85%', '74%'], ['45%', '95%'], ['8%', '79%']]},  
};

const YearsCircle = () => {
  const [lastIndex, setLastIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(0);

  const rotate = useCallback((i: any) => {
    const rotate = shiftMatrix[events.length]['rotate'];
    const rotateLength = rotate.length - 1;

    if(i === 0 && lastIndex === rotateLength) {
      gsap.to(".year-circle", {rotation: -rotate[1], duration: 0});
      gsap.to(".year-circle", {rotation: 0, duration: ROTATION_DUR});
    }    
    if(i === rotateLength && lastIndex === 0) {
      gsap.to(".year-circle", {rotation: rotate[rotateLength]+rotate[1], duration: 0});
      gsap.to(".year-circle", {rotation: rotate[rotateLength], duration: ROTATION_DUR});
    }    

    gsap.to(".year-circle", { 
      rotation: rotate[i], 
      duration: ROTATION_DUR,
      ease: "power2.out",
      onUpdate: function () {
        gsap.set(".circle-inside", { rotation: -gsap.getProperty(".year-circle", "rotation") });
      } 
    });

    setLastIndex(i)
    setSelectedEvent(i)
  }, [lastIndex, selectedEvent])

  useEffect(() => {
    gsap.to(".year.blue", {
      duration: 0.7,
      innerHTML: events[selectedEvent].start,
      snap:{
        innerHTML: 1
      }
    });
    gsap.to(".year.pink", {
      duration: 0.7,
      innerHTML: events[selectedEvent].end,
      snap:{
        innerHTML: 1
      }
    });
  }, [selectedEvent]);

  useEffect(() => {
    const container = document.querySelector('.timeline-container') as HTMLElement | null;
    const lineX = document.querySelector('.line-x') as HTMLElement | null;
    const lineY = document.querySelector('.line-y') as HTMLElement | null;
    if (lineY && lineX && container) {
        lineY.style.height = `${container.offsetHeight}px`;
        lineX.style.width = `${container.offsetWidth}px`;     
    }
  }, []);
  
  return (
    <section className="timeline-container">      
      <h2 className="timeline-title">
        <span className="timeline-line" />
        Исторические <br /> даты
      </h2>

      <div className="timeline-years">  
        <div className='line-y center-x'></div>
        <div className='line-x center-y'></div>      
        <span className="year blue">{events[0].start}</span>
        <div className="year-circle">
          {events.map((event, i) => 
            <div 
              className={`${i === lastIndex && 'active'} circle-number`} 
              key={event.theme}
              style={{top: shiftMatrix[events.length]['pos'][i][0], right: shiftMatrix[events.length]['pos'][i][1]}}
              onClick={() => rotate(i)}
            >
              <div className="circle-inside">
                <span className="circle-digit">{i+1}</span>                
                <span className="circle-label">{event.theme}</span>
              </div>
            </div>
          )}
        </div>
        <span className="year pink">{events[0].end}</span>
        <div className="line-mobile"></div>
        <div className="theme-mobile">{events[selectedEvent].theme}</div>
      </div>

      <div className="bottom-flex">
        <div className="timeline-footer">
          <div className="">
          <span className="page-indicator">{`${lastIndex+1}/${events.length}`}</span>
            <div className="arrows">
              <button className="arrow" onClick={() => rotate((lastIndex+events.length-1)%events.length)}>
                <img src={timelinenav} className='arrow-img' alt="" />
              </button>
              <button className="arrow" onClick={() => rotate((lastIndex+events.length+1)%events.length)}>
                <img src={timelinenav} className='arrow-img arrow-right' alt="" />
              </button>
            </div>
          </div>
          <div className="bottom-nav">
            {events.map((event, i) => 
              <div 
                className={`${i === lastIndex && 'active'} bottom-circle`} 
                key={event.theme}
                onClick={() => rotate(i)}
              >                
              </div>
            )}
          </div>
        </div>
        <EventsSlider events={events[selectedEvent].body} />
      </div>      
    </section>
  );
};

export default YearsCircle;
