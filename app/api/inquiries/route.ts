/** No storage is configured for this handoff. Never acknowledge an unsaved lead. */
export async function POST() {
  return Response.json(
    {ok:false,error:'שליחת פניות באתר אינה זמינה כרגע. אפשר ליצור קשר בטלפון, ב־WhatsApp או בדוא״ל.'},
    {status:503,headers:{'Cache-Control':'no-store'}},
  );
}
