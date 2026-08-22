import React, { useState } from 'react';
import {
  MapPin,
  Check,
  X,
  Clock,
  Truck,
  Sparkles,
  Building,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg">حدد منطقة التوصيل السريع</h2>
              <p className="text-xs text-emerald-200">
                خدمة توصيل فورية ومخصصة لجميع أحياء وكمبوندات ٦ أكتوبر والشيخ زايد
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
        <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
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
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
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
              placeholder="ابحث بالحي أو الكمبوند (مثلاً: بيفرلي هيلز، الحصري، سوديك، حدائق أكتوبر...)"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none text-stone-900"
            />
            <Navigation className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Zones List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredZones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => {
                  onSelectZone(zone);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        zone.city === 'zayed'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {zone.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'}
                    </span>
                    <h4 className="font-extrabold text-sm text-stone-900">
                      {zone.name}
                    </h4>
                  </div>

                  <p className="text-xs text-stone-600">
                    تشمل: {zone.districtNameAr}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Clock className="w-3 h-3" />
                      التوصيل {zone.estimatedDeliveryTime}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-stone-700">
                      رسوم التوصيل: {zone.deliveryFee} جنيه
                    </span>
                    <span>•</span>
                    <span className="text-stone-500">
                      (شحن مجاني للطلبات فوق {zone.freeDeliveryThreshold} ج)
                    </span>
                  </div>

                  {/* Landmarks tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {zone.popularLandmarks.map((lm, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded-full"
                      >
                        {lm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-stone-300" />
                  )}
                </div>
              </div>
            );
          })}

          {filteredZones.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-sm">
              لم نعثر على منطقة بهذا الاسم. يرجى التواصل معنا عبر واتساب لخدمتك فوراً!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-emerald-700" />
            التوصيل بمندوب خاص لحفظ درجات حرارة وسلامة مستحضرات العناية
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 font-bold rounded-xl text-stone-800 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
