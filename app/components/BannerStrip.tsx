'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface IBannerData {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
  sponsor?: string;
}

interface BannerStripProps {
  /** Page-specific placement: 'home' | 'about' | 'events'. Global banners are always included. */
  placement: string;
}

export function BannerStrip({ placement }: BannerStripProps) {
  const [banners, setBanners] = useState<IBannerData[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetches: Promise<Response>[] = [
      fetch(`/api/banners?placement=${placement}`),
    ];
    // Always fetch global banners too (unless this IS the global placement)
    if (placement !== 'global') {
      fetches.push(fetch('/api/banners?placement=global'));
    }

    Promise.all(fetches)
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(jsonArr => {
        const all: IBannerData[] = jsonArr.flatMap(j => j?.data ?? []);
        // Deduplicate by _id
        const seen = new Set<string>();
        setBanners(all.filter(b => (seen.has(b._id) ? false : (seen.add(b._id), true))));
      })
      .catch(() => {});
  }, [placement]);

  const visible = banners.filter(b => !dismissed.has(b._id));
  if (visible.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
      {visible.map(banner => (
        <div key={banner._id} className="relative rounded-2xl overflow-hidden shadow-md group">
          {banner.linkUrl ? (
            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
              <ImageWithFallback
                src={banner.imageUrl}
                alt={banner.altText ?? banner.title}
                className="w-full h-auto max-h-64 object-cover"
              />
            </a>
          ) : (
            <ImageWithFallback
              src={banner.imageUrl}
              alt={banner.altText ?? banner.title}
              className="w-full h-auto max-h-64 object-cover"
            />
          )}
          {banner.sponsor && (
            <div className="absolute bottom-2 left-3 text-xs text-white/80 bg-black/35 px-2 py-0.5 rounded-full backdrop-blur-sm select-none">
              Ad · {banner.sponsor}
            </div>
          )}
          <button
            onClick={() => setDismissed(prev => new Set([...prev, banner._id]))}
            className="absolute top-2 right-2 w-6 h-6 bg-black/40 hover:bg-black/65 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
