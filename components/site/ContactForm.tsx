'use client';
import {useRef,useState} from 'react';
import {Icon} from './Icons';
import {inquirySchema} from '@/lib/inquiry';
import {contact} from '@/lib/projects';

export function ContactForm({interest=''}:{interest?:string}) {
  const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [error,setError]=useState('');
  const [fields,setFields]=useState<Record<string,string>>({});
  const id=useRef('');const previousPayload=useRef('');
  const summary=useRef<HTMLParagraphElement>(null);
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(state==='sending')return;
    const form=event.currentTarget; const data=Object.fromEntries(new FormData(form));
    const payload=JSON.stringify(data);if(!id.current||previousPayload.current!==payload){id.current=crypto.randomUUID();previousPayload.current=payload;}
    const result=inquirySchema.safeParse({...data,requestId:id.current});
    if(!result.success){const errs:Record<string,string>={};for(const e of result.error.issues)errs[String(e.path[0])]=e.message;setFields(errs);setError('יש לבדוק את השדות המסומנים.');setState('error');setTimeout(()=>summary.current?.focus(),0);return;}
    setFields({});setError('');setState('sending');
    try { const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(result.data)}); const body=await response.json() as {error?:string;ok?:boolean};if(!response.ok||!body.ok)throw new Error(body.error||'לא ניתן לשלוח כרגע.');setState('success');setTimeout(()=>{summary.current?.focus({preventScroll:true});summary.current?.closest('.form-success')?.scrollIntoView({block:'center',behavior:'instant'})},0); }
    catch(e){setState('error');setError(e instanceof Error?e.message:'הפנייה לא נשמרה. אפשר לנסות שוב.');setTimeout(()=>summary.current?.focus(),0);}
  }
  if(state==='success')return <div className="form-success" role="status"><span className="success-symbol"><Icon name="check"/></span><h3>תודה על הפנייה.</h3><p ref={summary} tabIndex={-1}>הפרטים נקלטו ונשמרו. לשיחה ישירה עם הקבוצה אפשר להתקשר ל־<a href="tel:*6489" dir="ltr">{contact.phone}</a>.</p><button className="text-link" onClick={()=>{id.current='';setState('idle')}}>שליחת פנייה נוספת <Icon name="arrow"/></button></div>;
  return <form className="contact-form" onSubmit={submit} noValidate>
    <div className="form-row"><label>שם מלא <input name="name" autoComplete="name" required maxLength={100} aria-invalid={!!fields.name} aria-describedby={fields.name?'error-name':undefined} placeholder="איך קוראים לך?"/>{fields.name&&<small id="error-name">{fields.name}</small>}</label><label>טלפון <input type="tel" name="phone" autoComplete="tel" required maxLength={24} aria-invalid={!!fields.phone} aria-describedby={fields.phone?'error-phone':undefined} placeholder="מספר לחזרה"/>{fields.phone&&<small id="error-phone">{fields.phone}</small>}</label></div>
    <div className="form-row"><label>דוא״ל <input name="email" type="email" autoComplete="email" required maxLength={180} aria-invalid={!!fields.email} aria-describedby={fields.email?'error-email':undefined} placeholder="you@example.com"/>{fields.email&&<small id="error-email">{fields.email}</small>}</label><label>מה מעניין אותך? <select name="interest" defaultValue={interest}><option value="">בחרו נושא</option><option>אייל SEVEN7</option><option>מול ירדן</option><option>דירה בהנחה</option><option>מרכזים מסחריים</option><option>פנייה כללית</option></select></label></div>
    <label>משהו נוסף שחשוב שנדע <textarea name="message" rows={2} maxLength={3000} placeholder="אפשר לכתוב לנו כאן"/>{fields.message&&<small>{fields.message}</small>}</label>
    <label className="honeypot" aria-hidden="true">אתר <input name="website" autoComplete="off" tabIndex={-1}/></label>
    <p className="form-note">הפרטים ישמשו לצורך טיפול בפנייה שלכם.</p>
    {error&&<p role="alert" ref={summary} tabIndex={-1} className="form-error">{error}</p>}
    <button className="button button-dark" type="submit" disabled={state==='sending'}><span>{state==='sending'?'שולחים את הפנייה…':'נדבר על הבית שלכם'}</span><Icon name="arrow"/></button>
  </form>;
}
