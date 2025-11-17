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
        {/* <div className='hidden md:flex flex-col w-full md:w-4/12'>
        <div className='w-10/12'>
          <AussieLiftsLogoInline color="#9ac940"/>
        </div>
          <div className='flex w-full items-center justify-between pt-5'>
            <h1 className='font-bold text-2xl text-brand-green'>Design your lift</h1>
            <DownloadableButton name="Save"/>
          </div>
          <p className='hidden md:flex text-sm py-5'>We don&apos;t think getting a lift should be at the expense of style. We provide a huge range of customisation options for all of our products, and if there is something really different you need, talk to our sales team. Check out our most popular choices here!</p>
        
        <div className="hidden md:flex w-full justify-start items-start">
          <Filter/>
          <div className='absolute left-96 flex w-4/12 justify-center items-center'><CarViewToggle/></div>

        </div>
        <div className="hidden md:flex flex-row w-full justify-start"><ConfiguratorLeft/></div>
          
        </div> */}
        {/* <div className='flex flex-col md:flex-row md:w-8/12 justify-between'> */}
          <div className='flex w-full fixed md:relative top-6 md:top-0 left-0 h-[80vh] md:h-[100vh] bg-[#c1beb6] '>
            <AdvancedConfigurator/>
            <SceneNav />
            <VerticalZoomControls />
            <RequestQuoteFloat />
          </div>

          {/* Overlays */}
          
          <RightConfigPanel />
          
          
          {/* <div className='hidden md:flex w-full md:w-5/12 py-10'><Configurator/></div> */}

        {/* </div> */}
      </div>
      
    </main>
  );
}
