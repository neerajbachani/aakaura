"use client";
import React, { useState } from "react";
import { ChakraData } from "@/data/chakras";
import fonts from "@/config/fonts";


interface ChakraJourneyTemplateProps {
  chakra: ChakraData;
}

export default function ChakraJourneyTemplate({
  chakra,
}: ChakraJourneyTemplateProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Background image mapping for each chakra
  const getBackgroundImage = (slug: string) => {
    const backgrounds: Record<string, string> = {
      grounding: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop", // Mountain/Earth
      flow: "/images/flow-journey.png", // Water/Ocean
      power: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop", // Sunrise/Fire
      love: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop", // Forest/Nature
      expression: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop", // Sky/Clouds
      insight: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop", // Night Sky/Stars
      expansion: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2070&auto=format&fit=crop", // Cosmic/Universe
    };
    return backgrounds[slug] || backgrounds.grounding;
  };


  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section
        className={`relative bg-gradient-to-br ${chakra.colors.gradient} text-white py-20 px-4 overflow-hidden`}
      >
        {/* Background Image Layer */}
        <div 
          className="absolute hero-background inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getBackgroundImage(chakra.slug)})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            // background: `linear-gradient(135deg, ${chakra.colors.primary}dd 0%, ${chakra.colors.primary}aa 50%, ${chakra.colors.primary}dd 100%)`,
          }}
        />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <span className={`${fonts.mulish} text-sm font-semibold uppercase tracking-wider`}>
                  {chakra.tone} Journey
                </span>
              </div>
              
              <h1 className={`${fonts.merriweather} text-5xl md:text-6xl font-bold mb-4`}>
                {chakra.name}
              </h1>
              
              <p className={`${fonts.mulish} text-2xl mb-6 opacity-90`}>
                {chakra.sanskritName}
              </p>
              
              <p className={`${fonts.mulish} text-lg leading-relaxed opacity-90 mb-8`}>
                {chakra.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="#products"
                  className={`${fonts.merriweather} px-8 py-3 bg-white text-${chakra.colors.primary} rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl`}
                  style={{ color: chakra.colors.primary }}
                >
                  Explore Products
                </a>
                <a
                  href="#learn-more"
                  className={`${fonts.merriweather} px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full font-semibold hover:bg-white/20 transition-all`}
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right: Metrics & Symbol */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-9xl mb-4 animate-pulse">{chakra.symbol}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className={`${fonts.mulish} text-sm uppercase tracking-wider opacity-80 mb-2`}>
                    Location
                  </div>
                  <div className={`${fonts.merriweather} text-xl font-semibold`}>
                    {chakra.location}
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className={`${fonts.mulish} text-sm uppercase tracking-wider opacity-80 mb-2`}>
                    Element
                  </div>
                  <div className={`${fonts.merriweather} text-xl font-semibold`}>
                    {chakra.element}
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className={`${fonts.mulish} text-sm uppercase tracking-wider opacity-80 mb-2`}>
                    Mantra
                  </div>
                  <div className={`${fonts.merriweather} text-xl font-semibold`}>
                    {chakra.mantra}
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className={`${fonts.mulish} text-sm uppercase tracking-wider opacity-80 mb-2`}>
                    Crystals
                  </div>
                  <div className={`${fonts.merriweather} text-xl font-semibold`}>
                    {chakra.crystals.length}+
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section with Expandable Cards */}
      <section id="learn-more" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${fonts.merriweather} text-4xl font-bold mb-4`}
                style={{ color: chakra.colors.dark }}>
              Understanding the {chakra.name}
            </h2>
            <p className={`${fonts.mulish} text-lg text-neutral-600 max-w-3xl mx-auto`}>
              Discover the profound wisdom and transformative power of this energy center
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Benefits Card */}
            <div
              className="bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl cursor-pointer"
              style={{ borderColor: expandedCard === 1 ? chakra.colors.primary : '#e5e5e5' }}
              onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
            >
              <div className="p-8" style={{ backgroundColor: chakra.colors.light }}>
                <h3 className={`${fonts.merriweather} text-2xl font-bold mb-2`}
                    style={{ color: chakra.colors.dark }}>
                  Benefits & Qualities
                </h3>
                <p className={`${fonts.mulish} text-neutral-600`}>
                  {expandedCard === 1 ? "Click to collapse" : "Click to expand"}
                </p>
              </div>
              
              {expandedCard === 1 && (
                <div className="p-8 space-y-3">
                  {chakra.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: chakra.colors.primary }}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className={`${fonts.mulish} text-neutral-700`}>{benefit}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crystals Card */}
            <div
              className="bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-xl cursor-pointer"
              style={{ borderColor: expandedCard === 2 ? chakra.colors.primary : '#e5e5e5' }}
              onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
            >
              <div className="p-8" style={{ backgroundColor: chakra.colors.light }}>
                <h3 className={`${fonts.merriweather} text-2xl font-bold mb-2`}
                    style={{ color: chakra.colors.dark }}>
                  Associated Crystals
                </h3>
                <p className={`${fonts.mulish} text-neutral-600`}>
                  {expandedCard === 2 ? "Click to collapse" : "Click to expand"}
                </p>
              </div>
              
              {expandedCard === 2 && (
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {chakra.crystals.map((crystal, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg text-center border-2"
                        style={{ 
                          borderColor: chakra.colors.primary,
                          backgroundColor: chakra.colors.light 
                        }}
                      >
                        <div className="text-2xl mb-2">💎</div>
                        <p className={`${fonts.merriweather} font-semibold`}
                           style={{ color: chakra.colors.dark }}>
                          {crystal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section id="products" className="py-20 px-4" style={{ backgroundColor: chakra.colors.light }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`${fonts.merriweather} text-4xl font-bold mb-4`}
                style={{ color: chakra.colors.dark }}>
              Your {chakra.tone} Journey Collection
            </h2>
            <p className={`${fonts.mulish} text-lg text-neutral-600 max-w-3xl mx-auto`}>
              Curated tools and products to support your {chakra.name.toLowerCase()} activation
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            <div className="overflow-x-auto pb-8 scrollbar-hide">
              <div className="flex gap-6 min-w-max px-4">
                {chakra.products.map((product, index) => (
                  <div
                    key={index}
                    className="w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex-shrink-0 border-2"
                    style={{ borderColor: chakra.colors.primary }}
                  >
                    <div className="p-6" style={{ backgroundColor: chakra.colors.light }}>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: chakra.colors.primary }}
                      >
                        <span className={`${fonts.merriweather} text-white text-xl font-bold`}>
                          {product.step}
                        </span>
                      </div>
                      <h3 className={`${fonts.merriweather} text-xl font-bold mb-2`}
                          style={{ color: chakra.colors.dark }}>
                        {product.name}
                      </h3>
                      <p className={`${fonts.mulish} text-neutral-600`}>
                        {product.description}
                      </p>
                    </div>
                    <div className="p-6">
                      <button
                        className={`${fonts.merriweather} w-full py-3 rounded-full font-semibold text-white transition-all hover:opacity-90`}
                        style={{ backgroundColor: chakra.colors.primary }}
                      >
                        Explore Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`${fonts.merriweather} text-4xl font-bold mb-6`}
              style={{ color: chakra.colors.dark }}>
            Begin Your {chakra.tone} Journey Today
          </h2>
          <p className={`${fonts.mulish} text-lg text-neutral-600 mb-8`}>
            Transform your life by balancing and activating your {chakra.name.toLowerCase()}
          </p>
          <a
            href="/products"
            className={`${fonts.merriweather} inline-block px-12 py-4 rounded-full font-semibold text-white text-lg transition-all hover:opacity-90 shadow-lg hover:shadow-xl`}
            style={{ backgroundColor: chakra.colors.primary }}
          >
            Shop All Products
          </a>
        </div>
      </section>
    </div>
  );
}
