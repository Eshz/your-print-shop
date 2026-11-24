import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Little Makes | Their imagination, made real.',description:'Their drawing on stickers, cushions and gifts. Try a free preview.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
