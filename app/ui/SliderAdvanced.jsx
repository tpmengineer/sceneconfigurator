import React, { useState } from 'react';
import { useCustomisation } from '@/contexts/customisation';

const Slider2D = () => {

    const {
      width,

      depth,

      maxWidth,
      maxDepth,
      minWidth,
      minDepth
    } = useCustomisation();

    const GRAPHIC_SIZE = 100*maxDepth/2; 

    const scaledWidth = (width / maxWidth) * GRAPHIC_SIZE;
    const scaledDepth = (depth / maxDepth) * GRAPHIC_SIZE;
    const scaledMinWidth = (minWidth / maxWidth) * GRAPHIC_SIZE;
    const scaledMinDepth = (minDepth / maxDepth) * GRAPHIC_SIZE;

    return (
        <div className="flex flex-col bg-white w-full">
            
            <div className="flex flex-col">
                
                <div className="flex w-full items-center justify-center">
                    <div 
                        className="relative w-2/12 bg-brand-green/50 rounded-sm duration-300 ease-linear"
                        style={{ width: GRAPHIC_SIZE, height: GRAPHIC_SIZE }}
                        title={`Max Area: ${maxWidth}m x ${maxDepth}m`}
                    >

                        <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-green/50 duration-300 ease-linear"
                            style={{ width: scaledMinWidth, height: scaledMinDepth }}
                             title={`Min Area: ${minWidth}m x ${minDepth}m`}
                        ></div>
                        

                        <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-green/70 flex items-center justify-center transition-all duration-300 ease-linear"
                            style={{ width: scaledWidth, height: scaledDepth }}
                             title={`Current Area: ${width.toFixed(2)}m x ${depth.toFixed(2)}m`}
                        >

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slider2D;