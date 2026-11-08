import type {Metadata} from 'next';
import {SiteShell} from '@/components/site/SiteShell';
import './globals.css';
import './cinematic.css';
export const metadata:Metadata={metadataBase:new URL('https://yigal-group-architecture.kind-genet-1466.chatgpt.site'),title:{default:'קבוצת יגאל בוחבוט | איכות. עיצוב. מיקום.',template:'%s | קבוצת יגאל בוחבוט'},description:'קבוצת יגאל בוחבוט — ייזום ובנייה למגורים. הכירו את הפרויקטים, את הקבוצה ואת המידע לזוכי הגרלות דירה בהנחה.',icons:{icon:'/favicon.svg'},openGraph:{title:'Yigal Group | קבוצת יגאל בוחבוט',description:'מהתכנון ועד הבית.',locale:'he_IL',type:'website',images:['/images/eyal-hero.webp']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="he" dir="rtl"><head><link rel="preload" as="font" href="/fonts/assistant-hebrew.woff2" type="font/woff2" crossOrigin="anonymous"/><script dangerouslySetInnerHTML={{__html:`history.scrollRestoration='manual';if(performance.getEntriesByType('navigation')[0]?.type==='reload'){if(location.hash)history.replaceState(null,'',location.pathname+location.search);window.scrollTo(0,0);}`}}/></head><body><SiteShell>{children}</SiteShell></body></html>}
