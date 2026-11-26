'use client';
/* eslint-disable @next/next/no-img-element */
import {useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {collection, collectionImage} from '@/lib/collection';

const rows = [
  ['ceramic-mug', 'pendant', 'adult-tee', 'metal-keyring', 'tea-towel'],
  ['tote', 'ceramic-ornament', 'crewneck', 'travel-cup', 'framed-print'],
] as const satisfies ReadonlyArray<ReadonlyArray<typeof collection[number]['id']>>;

export function HeroGallery({lang}:{lang:'en'|'he'}) {
  const [paused, setPaused] = useState(false);
  const he = lang === 'he';
  return <section className="gift-marquee" aria-label={he?'מתנות מציורי ילדים':'Gifts made from children’s drawings'}>
    <div className="gift-marquee-window" data-paused={paused}>
      {rows.map((row, index) => <div className="gift-marquee-track" key={row[0]}>
        {[0, 1].map(copy => <div className="gift-marquee-set" key={copy} aria-hidden={copy===1 || undefined}>
          {row.map((id, tile) => {
            const product = collection.find(p => p.id === id)!;
            return <div key={id} className="gift-marquee-tile" data-portrait={(tile + index) % 2 === 0}>
              <img src={collectionImage(id)} width={640} height={640} alt={copy===1?'':he?product.he:product.name}/>
            </div>;
          })}
        </div>)}
      </div>)}
    </div>
    <button type="button" className="gift-marquee-control" onClick={()=>setPaused(!paused)}
      aria-label={paused?(he?'הפעלת הגלריה':'Play gallery'):(he?'עצירת הגלריה':'Pause gallery')}>
      {paused?<Play size={16}/>:<Pause size={16}/>}
    </button>
  </section>;
}
