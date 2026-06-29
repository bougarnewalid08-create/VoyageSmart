import React, { useState } from 'react';

const StayFilterPanel = ({ isMobile, onClose, onApplyFilters, currentFilters }) => {
  const [propertyType, setPropertyType] = useState(currentFilters?.propertyType || 'All');
  const [priceRange, setPriceRange] = useState(currentFilters?.priceRange || [100, 2500]);
  const [selectedFeatures, setSelectedFeatures] = useState(currentFilters?.features || []);

  const types = ['All', 'Villa', 'Apartment', 'Studio'];
  
  const featuresList = [
    { label: 'Private Pool', icon: 'pool', id: 'Private Pool' },
    { label: 'Beach Access', icon: 'beach_access', id: 'Beach Access' },
    { label: 'Free WiFi', icon: 'wifi', id: 'WiFi' },
    { label: 'Mountain View', icon: 'terrain', id: 'Mountain View' },
    { label: 'Pet Friendly', icon: 'pets', id: 'Pet Friendly' },
    { label: 'Air Conditioning', icon: 'ac_unit', id: 'Air Conditioning' }
  ];

  const toggleFeature = (id) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      propertyType,
      priceRange,
      features: selectedFeatures
    });
    if (isMobile) onClose();
  };

  const handleReset = () => {
    setPropertyType('All');
    setPriceRange([100, 2500]);
    setSelectedFeatures([]);
    onApplyFilters({
      propertyType: 'All',
      priceRange: [100, 2500],
      features: []
    });
    if (isMobile) onClose();
  };

  return (
    <div className={`font-['Inter'] flex flex-col ${isMobile ? 'h-full' : 'h-full'} bg-white`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Stay Filters</h3>
        {isMobile && (
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-10">Unique Accommodations</p>

      <div className="flex-1 overflow-y-auto pr-2 space-y-10 no-scrollbar pb-8">
        
        {/* Property Type */}
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Property Type</span>
          <div className="flex flex-wrap gap-3">
            {types.map((type) => (
              <button 
                key={type} 
                onClick={() => setPropertyType(type)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  propertyType === type 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Price Range</span>
            <span className="text-sm font-bold text-indigo-600">
              ${priceRange[0]} - ${priceRange[1] === 2500 ? '2,500+' : priceRange[1]}
            </span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="2500" 
            step="50"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
          />
        </div>

        {/* Features */}
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Features</span>
          <div className="space-y-4">
            {featuresList.map((feature) => (
              <label key={feature.id} className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  selectedFeatures.includes(feature.id)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">{feature.icon}</span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  selectedFeatures.includes(feature.id) ? 'text-indigo-600' : 'text-slate-600'
                }`}>
                  {feature.label}
                </span>
                <div className="ml-auto relative flex items-center justify-center">
                  <input 
                    className="peer h-6 w-6 rounded border-2 border-slate-200 appearance-none cursor-pointer checked:bg-blue-600 checked:border-blue-600 transition-all" 
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => toggleFeature(feature.id)}
                  />
                  {selectedFeatures.includes(feature.id) && (
                    <span className="material-symbols-outlined text-white text-[16px] absolute pointer-events-none font-bold">
                      check
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 mt-auto border-t border-slate-100 flex gap-4 bg-white">
        <button 
          onClick={handleReset}
          className="px-6 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
        >
          Reset
        </button>
        <button 
          onClick={handleApply}
          className="flex-1 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          View Properties
        </button>
      </div>
    </div>
  );
};

export default StayFilterPanel;
