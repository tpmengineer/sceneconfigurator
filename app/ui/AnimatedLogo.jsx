'use client'
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AnimatedLogo = ({ autoplay, ...props }) => {
  const personRef = useRef(null);
  const arrowRef = useRef(null);
  const animationTimeline = useRef(null); // Use a ref to store the timeline

  useEffect(() => {
    const person = personRef.current;
    const arrow = arrowRef.current;

    // Create the timeline once and store it in a ref
    // This allows us to control it consistently across mouse events
    if (!animationTimeline.current) {
      const timelineOptions = autoplay 
        ? { repeat: -1, yoyo: true } 
        : { paused: true, reversed: true };

      animationTimeline.current = gsap.timeline(timelineOptions);
      
      animationTimeline.current.to(person, {
        y: -15, // Adjust this value for how high you want them to go
        duration: 0.6,
        ease: 'power2.out',
      });

      animationTimeline.current.to(arrow, {
        rotation: -45, // Rotate 90 degrees to the left
        y:10,
        x:-10,
        transformOrigin: "0% 100%", // Rotate around its bottom-left corner
        duration: 0.6,
        ease: 'power2.out',
        // stroke: '#d3ff81ff'
      }, "<"); // Animate simultaneously with the person/platform movement
    }

    if (autoplay) {
      animationTimeline.current.play();
    } else {
      const onEnter = () => {
        // Ensure the timeline is at the start and then play it forward
        if (animationTimeline.current) {
          animationTimeline.current.play();
        }
      };

      const onLeave = () => {
        // Reverse the timeline
        if (animationTimeline.current) {
          animationTimeline.current.reverse();
        }
      };

      const svg = person.closest('svg');
      svg.addEventListener('mouseenter', onEnter);
      svg.addEventListener('mouseleave', onLeave);

      return () => {
        svg.removeEventListener('mouseenter', onEnter);
        svg.removeEventListener('mouseleave', onLeave);
        // Clean up the timeline when the component unmounts
        if (animationTimeline.current) {
          animationTimeline.current.kill();
          animationTimeline.current = null; // Clear the ref
        }
      };
    }

    return () => {
      // Clean up the timeline when the component unmounts
      if (animationTimeline.current) {
        animationTimeline.current.kill();
        animationTimeline.current = null; // Clear the ref
      }
    };
  }, [autoplay]); // Rerun effect if autoplay prop changes

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        viewBox="0 0 307.83 87.43"
        {...props}
      >
        {/* Aussie */}
        <path
          d="M37.98 77.13V52.78h7.93v22.49c0 3.77 1.6 5.5 5.05 5.5s6.33-1.79 9.21-4.4V52.78h7.93v33.93h-7.93v-4.6c-2.18 2.3-6.27 5.25-12.4 5.25s-9.78-3.52-9.78-10.24ZM74.37 82.05l4.29-4.79c2.55 2.17 6.33 4.02 10.67 4.02s6.78-1.08 6.78-3.89-3.45-3.59-7.54-4.54c-5.82-1.35-12.78-2.87-12.78-10.74 0-5.95 5.11-9.97 12.59-9.97 6.45 0 10.41 1.85 13.93 4.8l-3.77 5.11c-2.5-2.04-6.52-3.71-9.59-3.71-4.35 0-5.76 1.53-5.76 3.46 0 2.75 3.39 3.57 7.41 4.46 5.82 1.28 12.92 2.75 12.92 10.68 0 7.16-6.46 10.49-14.19 10.49-6.26 0-11.89-2.24-14.96-5.37ZM107.19 82.05l4.28-4.79c2.56 2.17 6.33 4.02 10.67 4.02s6.78-1.08 6.78-3.89-3.45-3.59-7.54-4.54c-5.82-1.35-12.78-2.87-12.78-10.74 0-5.95 5.11-9.97 12.59-9.97 6.45 0 10.42 1.85 13.93 4.8l-3.77 5.11c-2.5-2.04-6.52-3.71-9.59-3.71-4.35 0-5.76 1.53-5.76 3.46 0 2.75 3.39 3.57 7.41 4.46 5.82 1.28 12.92 2.75 12.92 10.68 0 7.16-6.46 10.49-14.19 10.49-6.26 0-11.89-2.24-14.96-5.37ZM143.45 46.9v-6.84h8.06v6.84h-8.06Zm.06 39.82V52.79h7.93v33.93h-7.93ZM158.68 69.78c0-12.91 9.14-17.65 16.17-17.65 7.61 0 14.9 4.54 14.9 18.35v1.85h-23.21c.32 6.13 4.09 8.82 9.08 8.82 4.41 0 6.96-1.47 9.53-3.97l4.15 4.09c-3.52 3.9-8.18 6.14-14.25 6.14-8.5 0-16.36-5.17-16.36-17.64Zm23.83-3.32c-.45-5.18-3-7.93-7.73-7.93-3.83 0-7.35 2.17-8.12 7.93h15.85ZM0 78.52c0-7.35 6.26-12.27 22.12-14.07v-1.02c0-3.39-1.79-4.86-5.56-4.86-4.73 0-8.57 2.3-11.44 4.6l-3.84-4.92c3.64-3.32 9.34-6.13 16.36-6.13 9.08 0 12.21 4.34 12.21 12.27v14c0 4.09.26 6.58.96 8.31h-7.92c-.45-1.4-.77-2.43-.77-4.35-3.45 3.52-7.47 4.86-12.53 4.86-5.5 0-9.59-3.07-9.59-8.69Zm22.12-1.28v-7.48c-9.4 1.27-14.38 3.57-14.38 7.29 0 2.68 1.85 4.09 4.73 4.09 4.03 0 7.16-1.54 9.65-3.9Z"
          fill={props.color || '#ffffff'}
        />

        {/* Person and the yellow Platform are grouped together to move as one */}
        <g ref={personRef}>
          {/* Person */}
          <path
            d="M218.8 28.87c2 0 3.62 1.62 3.62 3.62s-1.62 3.61-3.62 3.61-3.62-1.61-3.62-3.61 1.62-3.62 3.62-3.62Z"
            fill={props.color || '#ffffff'}
          />
          <path
            d="M221.35 39.23s-.09-.03-.13-.03h-4.82c-2.21 0-4.02 1.81-4.02 4.03v9.24c0 1.63 1 3.05 2.41 3.67v16.25h8.13V39.22h-1.58Z"
            fill={props.color || '#ffffff'}
          />
          {/* Yellow Platform */}
          <path
            d="M210.7 82.64h18.22v4H210.7z"
            fill={props.color || '#ffffff'}
          />
        </g>

        {/* Lifts */}
        <path
          d="M197.39 86.63v-47.3h7.93v47.3h-7.93ZM234.8 86.63V58.95h-5.88v-6.27h5.88v-3.45c0-5.69 2.37-10.1 11-10.1 1.47 0 4.09.25 4.66.32v6.07c-.51-.13-1.79-.25-2.69-.25-2.81 0-5.11.77-5.11 4.41v3h7.42v6.27h-7.42v27.68h-7.87ZM258.47 77.75V58.96h-5.88v-6.27h5.88V40.86h7.87v11.83h8.75v6.27h-8.75v16.81c0 3.64 1.09 5.11 4.99 5.11 1.15 0 2.62-.19 3.38-.45v6.2c-.83.19-3.77.45-5.75.45-8.63 0-10.49-3.2-10.49-9.33ZM278.69 81.97l4.28-4.8c2.55 2.18 6.33 4.03 10.67 4.03s6.78-1.08 6.78-3.9-3.45-3.58-7.55-4.54c-5.82-1.34-12.79-2.88-12.79-10.74 0-5.94 5.12-9.97 12.6-9.97 6.45 0 10.42 1.85 13.93 4.79l-3.77 5.12c-2.49-2.05-6.52-3.71-9.59-3.71-4.34 0-5.75 1.54-5.75 3.45 0 2.75 3.39 3.58 7.42 4.47 5.81 1.28 12.91 2.75 12.91 10.68 0 7.16-6.45 10.49-14.19 10.49-6.27 0-11.89-2.24-14.96-5.37Z"
          fill={props.color || '#ffffff'}
        />

        {/* Red Platform (arrow) - now with a ref */}
        <path
          ref={arrowRef}
          d="M206.88 24.86h14.21v-7.69h10.15L214.03 0l-17.14 17.17h9.99v7.69z"
          fill={props.color || '#ffffff'}
          // stroke='#d3ff81'
        />
      </svg>
    </div>
  );
};

export default AnimatedLogo;