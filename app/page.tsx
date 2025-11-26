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
    <main className="relative flex flex-col items-center justify-center bg-[#c1beb6] w-full h-[100vh] overflow-hidden">
      {/* Top bar with Back and Request Quote */}
      <TopBar />

      <div className='flex flex-col lg:flex-row w-full h-full items-center text-brand-grey'>
        
          <div className='flex w-full fixed md:relative top-0 left-0 h-[100vh] bg-[#c1beb6] '>
            <AdvancedConfigurator/>
            <SceneNav />
            <VerticalZoomControls />
            <RequestQuoteFloat />
          </div>

          {/* Overlays */}
          <RightConfigPanel />

      </div>
      
    </main>
  );
}
