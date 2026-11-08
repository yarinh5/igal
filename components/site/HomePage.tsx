import {HomeTransitions} from '../motion/HomeTransitions';
import {HyperScene} from '../motion/HyperScene';
import {Hero} from './Hero';
import {ProjectRail} from './ProjectRail';
import {ContactSection} from './ContactSection';
import {Icon} from './Icons';
import {groupDescription} from '@/lib/projects';

const lotteryIds=['2092','1975','1974','1973','1972','1971','1970','1969','1968'];

export function HomePage(){return <main id="main" data-home-motion>
 <HomeTransitions/>
 <Hero/>
 <section className="threshold-section" data-scroll-section="threshold" aria-label="מהמחשבה אל המרחב"><HyperScene scene="threshold" label="מעבר אדריכלי מן התכנון אל המרחב"/></section>
 <section id="about" className="intro-section section" data-scroll-section="about"><div className="section-index"><span className="eyebrow">01 / הקבוצה</span><span className="cross-detail" aria-hidden="true"/></div><div className="intro-grid"><h2 data-reveal>מהתכנון.<br/>דרך הביצוע.<br/><em>עד הבית.</em></h2><div className="intro-text" data-reveal><p>{groupDescription}</p><p className="muted">מעורבות אישית, הקפדה על איכות ותשומת לב לכל שלב בדרך. כך אנחנו יוצרים סביבת מגורים לאנשים שבוחרים בנו.</p><a href="/about" className="text-link">הסיפור של הקבוצה <Icon name="arrow"/></a></div><div className="intro-year" data-reveal><span dir="ltr">2006</span><p>השנה שבה התחלנו לבנות</p><div className="year-line"/></div></div></section>
 <ProjectRail/>
 <section className="passage-section" data-hyper-passage data-scroll-section="passage" aria-label="מעבר מן הפרויקטים אל דרך העבודה"><div className="passage-sticky"><HyperScene scene="passage" mode="passage" label="מסגרות אדריכליות יוצרות מעבר אל תהליך העבודה"/></div></section>
 <section className="craft-section section" id="approach" data-scroll-section="approach"><div className="craft-top"><div><span className="eyebrow">03 / הדרך שלנו</span><h2 data-reveal>איכות מתחילה<br/><em>הרבה לפני המפתח.</em></h2></div><p data-reveal>תכנון פונקציונלי, עבודה עם אנשי מקצוע<br/>וליווי אישי לאורך הדרך.</p></div><div className="craft-content"><HyperScene scene="process" label="המחשה של שלבי התכנון, הביצוע והמסירה"/><div className="craft-steps">{[['01','תכנון מדויק','חשיבה אדריכלית על המרחב ועל האנשים שיחיו בו.'],['02','ביצוע מוקפד','שילוב של ניסיון מקצועי, חומרי בנייה ואנשי מקצוע.'],['03','ליווי אישי','מעורבות מנהלי הקבוצה, מהתכנון ועד למסירה.']].map(([n,t,d])=><div key={n} data-reveal><span dir="ltr">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div></section>
 <section className="chapter-section" data-scroll-section="chapter"><HyperScene scene="chapter" label="קומפוזיציה אדריכלית של איכות, עיצוב ומיקום"/><div className="chapter-caption"><span className="eyebrow">מרחבים של אפשרויות</span><a href="/commercial" className="text-link">למרכזים המסחריים <Icon name="arrow"/></a></div></section>
 <section id="lotteries" className="lottery-intro section" data-scroll-section="lotteries"><div className="lottery-copy"><span className="eyebrow">04 / דירה בהנחה</span><h2 data-reveal>הבית שלכם.<br/><em>המידע במקום אחד.</em></h2><p>כל המידע לזוכי הגרלות מול ירדן: מסמכי הפרויקט, מפרטים, תכניות ותשריטי הדירות.</p><a href="/lotteries" className="button button-dark">לאזור ההגרלות <Icon name="arrow"/></a></div><div className="lottery-quick"><span className="eyebrow">בחרו את מספר ההגרלה שלכם</span><div className="lottery-numbers">{lotteryIds.map(id=><a href={'/lotteries/'+id} key={id}><span dir="ltr">{id}</span><Icon name="diagonal"/></a>)}</div><p className="fineprint">מידע נגיש, לפי הגרלה, בניין ודירה.</p></div></section>
 <section className="blueprint-section section" data-scroll-section="blueprint"><div><span className="eyebrow">מהרעיון למרחב</span><h2 data-reveal>כל בית מתחיל<br/><em>במחשבה.</em></h2><p>היכרות עם הקבוצה, האנשים והערכים<br/>שמלווים את הפרויקטים שלנו.</p><a href="/about" className="text-link">להכיר מקרוב <Icon name="arrow"/></a></div><HyperScene scene="blueprint" label="קווים אדריכליים הופכים למבנה מופשט"/></section>
 <ContactSection/>
</main>}
