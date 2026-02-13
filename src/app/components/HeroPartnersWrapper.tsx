import React from 'react';
import { Hero } from './Hero';
import { Partners } from './Partners';

export function HeroPartnersWrapper() {
    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                <Hero isWrapperMode={true} />
            </div>
            <div className="flex-shrink-0">
                <Partners />
            </div>
        </div>
    );
}
