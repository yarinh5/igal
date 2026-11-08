import {ProjectExplorer} from '@/components/site/ProjectExplorer';
export const metadata={title:'הפרויקטים שלנו'};
export default function Projects(){return <main id="main" className="inner-page"><section className="page-heading section"><span className="eyebrow">OUR PROJECTS / הפרויקטים שלנו</span><h1>מקומות.<br/><em>שהופכים לבית.</em></h1><p>הפרויקטים של קבוצת יגאל בוחבוט —<br/>מגורים, תכנון וביצוע, בבית שאן, בעפולה ובחיפה.</p></section><section className="section project-explorer"><ProjectExplorer/></section></main>}
