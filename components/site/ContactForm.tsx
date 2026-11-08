import {Icon} from './Icons';
import {contact} from '@/lib/projects';

/** Direct contact only until a submission backend is connected. */
export function ContactForm({interest=''}:{interest?:string}) {
  const email='mailto:'+contact.email+(interest?'?subject='+encodeURIComponent(interest):'');
  return <div className="contact-direct">
    <h3>נשמח לשמוע מכם.</h3>
    <p>אפשר ליצור איתנו קשר ישירות בדרך שנוחה לכם.</p>
    <a className="button button-dark" href="tel:*6489"><span>לשיחה עם הקבוצה</span><Icon name="arrow"/></a>
    <a className="button button-outline" href={contact.whatsapp} target="_blank" rel="noreferrer"><span>פנייה ב־WhatsApp</span><Icon name="diagonal"/></a>
    <a className="text-link" href={email}>שליחת דוא״ל <Icon name="mail"/></a>
  </div>;
}
