import React from 'react';
import { TypewriterText } from '../ui/typewriter-text';

interface TrustStripProps {
  title: string;
}

export const TrustStrip: React.FC<TrustStripProps> = ({ title }) => {
  return (
    <section className="pt-[100px] pb-0 px-6 md:px-0 bg-background">
      <div className="container mx-auto px-0 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          <TypewriterText 
            text={title} 
            speed={80} 
            delay={500}
            className="text-2xl md:text-3xl font-bold"
          />
        </h2>
        <div className="relative overflow-hidden group">
          {/* Left blur gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          {/* Right blur gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          <div className="flex animate-scroll space-x-8 opacity-100 group-hover:pause-animation">
            {/* First set of logos */}
            <img src="/clintes-logos/Advanced.png" alt="Advanced" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Al-ajmi.png" alt="Al-ajmi" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Almajdouié.png" alt="Almajdouié" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Alrawaf.png" alt="Alrawaf" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/ALTAMIMI.png" alt="ALTAMIMI" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/ansab.png" alt="ansab" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Aramco.png" alt="Aramco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/BOUTIQUE.png" alt="BOUTIQUE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Cat Group.png" alt="Cat Group" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/El Seif.png" alt="El Seif" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/EQUATE.png" alt="EQUATE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Euro Consult.png" alt="Euro Consult" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/GACA.png" alt="GACA" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Giza Systems.png" alt="Giza Systems" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Jabco.png" alt="Jabco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/MAIADEN.png" alt="MAIADEN" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/MAS.png" alt="MAS" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Mastoura.png" alt="Mastoura" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Mobco.png" alt="Mobco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/NCH.png" alt="NCH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Neom.png" alt="Neom" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Nesma.png" alt="Nesma" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/PIF.png" alt="PIF" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Sabic.png" alt="Sabic" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/SAMA ENERGY.png" alt="SAMA ENERGY" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/SAR.png" alt="SAR" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Saudi Electricity company.png" alt="Saudi Electricity" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/SCTNH.png" alt="SCTNH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Shibah Al Jazira.png" alt="Shibah Al Jazira" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Sinopec.png" alt="Sinopec" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Sipchem.png" alt="Sipchem" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/wsp.png" alt="WSP" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            
            {/* Duplicate set for seamless loop */}
            <img src="/clintes-logos/Advanced.png" alt="Advanced" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Al-ajmi.png" alt="Al-ajmi" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Almajdouié.png" alt="Almajdouié" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Alrawaf.png" alt="Alrawaf" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/ALTAMIMI.png" alt="ALTAMIMI" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/ansab.png" alt="ansab" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Aramco.png" alt="Aramco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/BOUTIQUE.png" alt="BOUTIQUE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Cat Group.png" alt="Cat Group" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/El Seif.png" alt="El Seif" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/EQUATE.png" alt="EQUATE" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Euro Consult.png" alt="Euro Consult" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/GACA.png" alt="GACA" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Giza Systems.png" alt="Giza Systems" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Jabco.png" alt="Jabco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/MAIADEN.png" alt="MAIADEN" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/MAS.png" alt="MAS" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Mastoura.png" alt="Mastoura" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Mobco.png" alt="Mobco" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/NCH.png" alt="NCH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Neom.png" alt="Neom" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Nesma.png" alt="Nesma" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/PIF.png" alt="PIF" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Sabic.png" alt="Sabic" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/SAMA ENERGY.png" alt="SAMA ENERGY" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/SAR.png" alt="SAR" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Saudi Electricity company.png" alt="Saudi Electricity" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/SCTNH.png" alt="SCTNH" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Shibah Al Jazira.png" alt="Shibah Al Jazira" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Sinopec.png" alt="Sinopec" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/Sipchem.png" alt="Sipchem" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
            <img src="/clintes-logos/wsp.png" alt="WSP" className="h-48 w-48 object-contain flex-shrink-0 transition-all duration-300 hover:scale-110 hover:brightness-110 hover:drop-shadow-lg" />
          </div>
        </div>
      </div>
      
      {/* Laser Flow Animation */}
      <div className="relative h-[3px] overflow-hidden mt-12">
        <div 
          className="absolute inset-0 animate-laser-flow"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.6) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </section>
  );
};

