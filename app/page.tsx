import Storefront from '@/components/storefront';
export default function Home(){return <Storefront showcaseEnabled productVideoUrl={process.env.PRODUCT_VIDEO_URL} productVideoCaptionsUrl={process.env.PRODUCT_VIDEO_CAPTIONS_URL} productVideoCaptionsLang={process.env.PRODUCT_VIDEO_CAPTIONS_LANG}/>;}
