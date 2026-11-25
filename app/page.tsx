import Storefront from '@/components/storefront';
import {generationEnabled} from '@/lib/generated-artwork';
export default function Home(){return <Storefront showcaseEnabled aiArtworkEnabled={generationEnabled()} productVideoUrl={process.env.PRODUCT_VIDEO_URL} productVideoCaptionsUrl={process.env.PRODUCT_VIDEO_CAPTIONS_URL} productVideoCaptionsLang={process.env.PRODUCT_VIDEO_CAPTIONS_LANG}/>;}
