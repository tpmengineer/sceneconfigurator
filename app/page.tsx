'use client';
import Configurator from '@/app/ui/configurator';
import ConfiguratorLeft from './ui/configurator_left';
import AdvancedConfigurator from '@/experience/car_configurator';
import LogoPrimary from './ui/svg_logo_primary';
import { useEffect, useState } from 'react';
import DownloadableButton from './components/save_button';
import AussieLiftsLogoInline from '@/app/ui/AussieLiftsLogoInline'
import Filter from '@/app/components/Filter'
import ToggleSwitch from "@/app/ui/toggle"; 
import { useCustomisation } from '@/contexts/customisation';
import CarViewToggle from '@/app/ui/CarViewToggle'
import RightConfigPanel from '@/app/ui/RightConfigPanel';
import SceneNav from '@/app/ui/SceneNav';
import VerticalZoomControls from '@/app/ui/VerticalZoomControls';
import TopBar from '@/app/ui/TopBar';
import RequestQuoteFloat from '@/app/ui/RequestQuoteFloat';



export default function Home() {

  const [viewportHeight, setViewportHeight] = useState('100vh');

  

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    updateHeight(); // Set height on initial render
    window.addEventListener('resize', updateHeight); // Update on resize

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <main
      className="relative flex flex-col bg-[#c1beb6] w-full overflow-hidden"
      style={{ height: viewportHeight }}
    >
      {/* Top bar with Back and Request Quote */}
      <TopBar />

      <div className='flex flex-col md:flex-row w-full h-full min-h-0 text-brand-grey'>

          {/* Scene: top portion of the screen on mobile, remaining width on desktop */}
          <div className='relative flex flex-1 min-h-0 w-full md:h-full bg-[#c1beb6]'>
            <AdvancedConfigurator/>
            <SceneNav />
            <VerticalZoomControls />
            <RequestQuoteFloat />
          </div>

          {/* Options: bottom sheet on mobile, right panel on desktop */}
          <RightConfigPanel />

      </div>

    </main>
  );
}
