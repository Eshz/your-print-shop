import {Eye, ShieldCheck, Truck} from 'lucide-react';

export function HeroBenefits({lang}: {lang: 'en' | 'he'}) {
  const hebrew = lang === 'he';
  return <ul className="hero-benefits" aria-label={hebrew ? 'פרטי השירות' : 'Shop benefits'}>
    <li><Eye aria-hidden="true"/>{hebrew ? 'תצוגה בחינם' : 'Free preview'}</li>
    <li><Truck aria-hidden="true"/>{hebrew ? 'משלוח חינם מ־₪249' : 'Free shipping from ₪249'}</li>
    <li><ShieldCheck aria-hidden="true"/>{hebrew ? 'העלאה פרטית' : 'Private uploads'}</li>
  </ul>;
}
