'use client';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="section empty"><h1>A little hiccup.</h1><p>We couldn’t load the shop. Your drawing has not been shared publicly.</p><Button onClick={reset}>Try again</Button><Link href="/">Return to the shop</Link></main>;}
