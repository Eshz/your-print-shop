/* eslint-disable @next/next/no-img-element */
import {Palette} from 'lucide-react';

const examples = [
  {asset:'magnets',alt:'The drawing as a magnetic storytelling game',shape:'landscape'},
  {asset:'cushion-front',alt:'A shaped cushion made from the supplied drawing',shape:'square'},
  {asset:'stickers',alt:'A sticker sheet made from the same drawing',shape:'tall'},
  {asset:'cushion-front',alt:'The original characters on a shaped cushion',shape:'square'},
  {asset:'hero',alt:'The drawing on a sticker sheet and cushion',shape:'landscape'},
];

export function HeroGallery({showcaseEnabled}:{showcaseEnabled:boolean}) {
  return <div className="hero-gallery" aria-label="Gift ideas made from one drawing">
    <div className="hero-gallery-row">
      {examples.map((example,i)=><div className={`hero-example ${example.shape}`} key={`${example.asset}-${i}`}>
        {showcaseEnabled?<img src={`/showcase/${example.asset}.png`} alt={example.alt} fetchPriority={i===2?'high':undefined}/>:<div className="hero-example-empty"><Palette size={40}/><span>Your drawing here</span></div>}
      </div>)}
    </div>
    <div className="hero-gallery-row hero-gallery-row-secondary" aria-hidden="true">
      {[examples[2],examples[0],examples[1],examples[4]].map((example,i)=><div className={`hero-example ${example.shape}`} key={`${example.asset}-${i}`}>
        {showcaseEnabled?<img src={`/showcase/${example.asset}.png`} alt=""/>:<div className="hero-example-empty"><Palette size={40}/></div>}
      </div>)}
    </div>
  </div>;
}
