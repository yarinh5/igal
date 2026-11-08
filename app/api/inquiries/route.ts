import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { inquiries } from '@/db/schema';
import { inquirySchema } from '@/lib/inquiry';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'הבקשה אינה מורשית.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'פורמט בקשה לא נתמך.' }, { status: 415 });
  try {
    const body = await request.text();
    if (body.length > 14000) return Response.json({ error: 'הפנייה ארוכה מדי.' }, { status: 413 });
    let json: unknown;
    try { json = JSON.parse(body); } catch { return Response.json({ error: 'לא ניתן לקרוא את הפנייה.' }, { status: 400 }); }
    const parsed = inquirySchema.safeParse(json);
    if (!parsed.success) return Response.json({ error: 'יש לבדוק את פרטי הפנייה.', fields: parsed.error.flatten().fieldErrors }, { status: 422 });
    if (parsed.data.website) return Response.json({ error: 'לא ניתן לשלוח את הפנייה.' }, { status: 422 });
    const { requestId, website: _website, ...data } = parsed.data;
    const db=getDb();
    await db.insert(inquiries).values({ id: requestId, ...data, createdAt: Date.now() }).onConflictDoNothing();
    const stored=await db.select().from(inquiries).where(eq(inquiries.id,requestId)).get();
    if(!stored||Object.entries(data).some(([key,value])=>stored[key as keyof typeof stored]!==value)) return Response.json({error:'פרטי הפנייה השתנו. יש לשלוח מחדש.'},{status:409});
    return Response.json({ ok: true, reference: requestId }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Inquiry persistence failed', error instanceof Error ? error.name : 'unknown');
    return Response.json({ error: 'הפנייה לא נשמרה. אפשר לנסות שוב או ליצור קשר בטלפון.' }, { status: 503 });
  }
}
