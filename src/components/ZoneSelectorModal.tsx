import React, { useState } from 'react';
import {
  MapPin,
  Check,
  X,
  Clock,
  Navigation,
} from 'lucide-react';
import { DeliveryZone } from '../types';
import { OCTOBER_ZAYED_ZONES } from '../data/zones';

interface ZoneSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
}

export const ZoneSelectorModal: React.FC<ZoneSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onSelectZone,
}) => {
  const [cityFilter, setCityFilter] = useState<'all' | 'october' | 'zayed'>('all');
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredZones = OCTOBER_ZAYED_ZONES.filter((z) => {
    const matchesCity = cityFilter === 'all' || z.city === cityFilter;
    const matchesSearch =
      filterQuery === '' ||
      z.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      z.districtNameAr.toLowerCase().includes(filterQuery.toLowerCase()) ||
      z.popularLandmarks.some((l) => l.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg">حددي منطقة التوصيل السريع</h2>
              <p className="text-xs text-pink-100">
                خدمة توصيل خلال ٢٤ ساعة لجميع أحياء ٦ أكتوبر والشيخ زايد وحدائق أكتوبر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Filter Tabs & Search */}
        <div className="p-4 bg-pink-50/30 border-b border-pink-100 space-y-3">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'كل المناطق (أكتوبر وزايد)' },
              { id: 'zayed', label: 'الشيخ زايد 🏙️' },
              { id: 'october', label: 'مدينة ٦ أكتوبر 🏢' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCityFilter(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cityFilter === tab.id
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-pink-50 hover:text-pink-800 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="ابحثي بالحي أو الكمبوند (مثلاً: بيفرلي هيلز، الحصري، سوديك، حدائق أكتوبر...)"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none text-stone-900"
            />
            <Navigation className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Zones Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredZones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => {
                  onSelectZone(zone);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-right ${
                  isSelected
                    ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-pink-300 hover:bg-pink-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-sm text-stone-900">{zone.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 font-bold">
                        {zone.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                      {zone.popularLandmarks.join(' • ')}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-pink-100 text-stone-600">
                  <div className="flex items-center gap-1 text-pink-700 font-bold">
                    <Clock className="w-3 h-3" />
                    <span>{zone.estimatedDeliveryTime}</span>
                  </div>
                  <div className="font-bold">
                    الشحن: {zone.deliveryFee} ج{' '}
                    <span className="text-stone-400 font-normal">
                      (مجاني فوق {zone.freeDeliveryThreshold} ج)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
