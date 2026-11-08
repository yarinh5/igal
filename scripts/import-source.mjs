import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createServer } from 'node:http';

// Rebuild the searchable library from the captured public DOM. Page titles are
// authoritative: the original 1969 and 1975 apartment-page slugs are swapped.
if(process.argv.includes('--derive')){
  const pages=JSON.parse(await readFile('content/source-pages.json','utf8'));
  const clean=text=>text.replace(/[\u200b\u200c\u200d\ufeff]/g,'').replace(/\.{3,}/g,'').replace(/\s+/g,' ').trim();
  const isPdf=link=>/\.pdf(?:$|[?#])/i.test(link.url);
  const complexIds={'2092':'71414','1975':'61526','1974':'61557','1973':'61560','1972':'61558','1971':'61561','1970':'61559','1968':'50683','1969':'50684'};
  const lotteries=pages.filter(page=>page.title.startsWith('הגרלה מס')).map(page=>{
    const id=page.title.match(/\d+/)[0];
    const planPage=pages.find(p=>p.title.startsWith(`תשריטי דירה הגרלה ${id} `));
    const floorPage=pages.find(p=>p.title.startsWith(`תוכנית קומה הגרלה ${id} `));
    if(!planPage)throw new Error(`Missing apartment page for ${id}`);
    const buildings=new Map();
    const headings=planPage.blocks.filter(b=>/^(?:בניין\s+)?[A-E]\d+$/.test(clean(b.label)));
    for(const link of planPage.links.filter(isPdf)){
      const sourceLabel=clean(link.label);
      let building=sourceLabel.match(/בניין\s*([A-E]\d+)/)?.[1];
      if(!building){
        // Buildings occupy rows/columns in the rendered source; choose the
        // preceding heading in the same horizontal interval, then the nearest.
        const candidates=headings.filter(h=>h.y<=link.y).map(h=>({
          ...h,score:Math.max(h.x-link.x,link.x-(h.x+h.w),0)*1000+(link.y-h.y)
        })).sort((a,b)=>a.score-b.score);
        building=candidates[0]?.label.match(/[A-E]\d+/)?.[0];
      }
      // A few original links split "דירה-6" into two anchors. The full
      // containing paragraph supplies the number; keep both source occurrences.
      const containingBlock=planPage.blocks.find(b=>link.x>=b.x&&link.x<=b.x+b.w&&link.y>=b.y-2&&link.y<=b.y+b.h&&/דירה/.test(b.label));
      const number=sourceLabel.match(/דירה[\s-]*(\d+)/)?.[1]||sourceLabel.match(/(\d+)\s*דירה/)?.[1]||clean(containingBlock?.label||'').match(/דירה[\s-]*(\d+)/)?.[1];
      if(!building||!number)throw new Error(`Unresolved apartment ${id}: ${JSON.stringify(link)}`);
      if(!buildings.has(building))buildings.set(building,[]);
      buildings.get(building).push({number,label:`בניין ${building} · דירה ${number}`,url:link.url});
    }
    const documents=page.links.filter(link=>isPdf(link)||link.url.startsWith('https://drive.google.com/')).map(link=>{
      const label=clean(link.label);
      if(!label)throw new Error(`Missing document label in ${id}`);
      const category=/כנס|הקלט|מצגת/.test(label)?'כנס זוכים':/היתר/.test(label)?'היתרים':/חוזה|ייפוי|בנקאי|התחייבות|תצהיר|תמורה/.test(label)?'מסמכים משפטיים':'תכנון ומפרט';
      return {label,url:link.url,category};
    });
    return {
      id,complexId:complexIds[id],sourceUrl:page.url,
      description:clean(page.blocks.find(b=>b.label.includes('528'))?.label||''),
      documents,
      buildings:[...buildings].map(([id,apartments])=>({id,apartments:apartments.sort((a,b)=>Number(a.number)-Number(b.number))})).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true})),
      floorPlans:(floorPage?.links.filter(isPdf)||[]).map(link=>({label:clean(link.label),url:link.url})),
      apartmentSourceUrl:planPage.url,
      ...(floorPage?{floorPlanSourceUrl:floorPage.url}:{})
    };
  }).sort((a,b)=>Number(b.id)-Number(a.id));
  const sourcePdfs=pages.flatMap(p=>p.links.filter(isPdf).map(l=>l.url));
  const libraryPdfs=lotteries.flatMap(l=>[...l.documents,...l.buildings.flatMap(b=>b.apartments),...l.floorPlans].filter(isPdf).map(d=>d.url));
  const frequencies=urls=>JSON.stringify([...urls.reduce((m,u)=>m.set(u,(m.get(u)||0)+1),new Map())].sort(([a],[b])=>a.localeCompare(b)));
  if(lotteries.length!==9||sourcePdfs.length!==554||new Set(sourcePdfs).size!==535||frequencies(sourcePdfs)!==frequencies(libraryPdfs))throw new Error('Source PDF preservation invariant failed');
  // A supplied source link must never become an availability claim. No status
  // field is derived from PDF presence, apartment order, or missing rows.
  await writeFile('content/lotteries.json',JSON.stringify(lotteries,null,2)+'\n');
  console.log(JSON.stringify({pages:pages.length,lotteries:lotteries.length,pdfOccurrences:libraryPdfs.length,uniquePdfs:new Set(libraryPdfs).size,groups:lotteries.map(l=>({id:l.id,documents:l.documents.length,apartments:l.buildings.reduce((n,b)=>n+b.apartments.length,0),buildings:l.buildings.map(b=>`${b.id}:${b.apartments.length}`),floorPlans:l.floorPlans.length}))},null,2));
  process.exit(0);
}

// Local-only collection UI for source data observed through the browser.
// It accepts public website text and URLs, never credentials or personal records.
if(process.argv.includes('--collect')){
  const server=createServer(async(req,res)=>{
    if(req.method==='POST'&&req.url==='/capture'){
      if(req.headers.origin!=='http://127.0.0.1:4822'){res.writeHead(403);res.end('Invalid origin');return;}
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>8_000_000){res.writeHead(413);res.end();return;}chunks.push(chunk);}
      try{
        const payload=JSON.parse(new URLSearchParams(Buffer.concat(chunks).toString()).get('data')||'null');
        if(!Array.isArray(payload)||payload.length!==30)throw new Error('Expected the 30 source page records');
        await mkdir(path.join(process.cwd(),'content'),{recursive:true});
        await writeFile(path.join(process.cwd(),'content/source-pages.json'),JSON.stringify(payload,null,2)+'\n');
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end('<h1>Saved 30 source pages</h1><p>The local JSON capture has been written.</p>');
      }catch(error){res.writeHead(400);res.end(String(error));}
      return;
    }
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end('<!doctype html><html lang="en"><title>Local source capture</title><body><h1>Local source capture</h1><form method="post" action="/capture"><label for="data">Public source page records</label><textarea id="data" name="data" rows="12" cols="80"></textarea><button type="submit">Save source records</button></form></body></html>');
  });
  server.listen(4822,'127.0.0.1',()=>console.log('Local collection UI: http://127.0.0.1:4822'));
  await new Promise(()=>{});
}

const root = process.cwd();
const origin = 'https://static.wixstatic.com/media/';
const items = [
  ['eyal-hero', 'd42bfc_c09f5706a70341789780c649909be701~mv2.jpg', 'הדמיית פרויקט אייל SEVEN7 בבית שאן', 'https://www.yigal-group.com/services-5'],
  ['eyal-street', 'd42bfc_4040c0164abd4af6aa0d7216118f34d8~mv2.jpg', 'הדמיית רחוב בפרויקט אייל SEVEN7', 'https://www.yigal-group.com/services-5'],
  ['eyal-aerial', 'd42bfc_313239b643e74329a83828cf3d8f9471~mv2.jpeg', 'מבט על פרויקט אייל SEVEN7', 'https://www.yigal-group.com/services-5'],
  ['eyal-building', 'd42bfc_fa5d1bea4847440091891c2cc902ccfc~mv2.jpeg', 'הדמיית בניין בפרויקט אייל SEVEN7', 'https://www.yigal-group.com/services-5'],
  ['mol-yarden', 'd42bfc_a7b073c56e3c4fb2ba1d2499e4cf034b~mv2.jpg', 'הדמיית פרויקט מול ירדן בבית שאן', 'https://www.yigal-group.com/copy-of-הגרלה-מספר-1970'],
  ['home-aerial', 'd42bfc_95472cbf8c744c9e8760e6257ba9721c~mv2.jpg', 'הדמיית המתחם בבית שאן מתוך דף הבית', 'https://www.yigal-group.com/'],
  ['nof-zemer-night', 'd42bfc_167d6da58d71456a9c6ca9bd43182889~mv2.jpg', 'הדמיית ערב של נוף זמר בחיפה', 'https://www.yigal-group.com/'],
  ['commercial', 'd42bfc_636cf450cebf408e9753230e1895edff~mv2.jpeg', 'הדמיית מרכז מסחרי מתוך אתר הקבוצה', 'https://www.yigal-group.com/'],
  ['c1-afula', 'd42bfc_32168483972a4845acbf37414ad12a9b~mv2.jpg', 'פרויקט C1 בעפולה', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['nofim-b', 'd42bfc_ddaa3bd6990e4629800ddaa2f6522612~mv2.jpg', 'פרויקט נופים שלב ב בבית שאן', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['nofim-a', 'd42bfc_ac066ccab5c949e7bb8359c63d13df0c~mv2.jpg', 'פרויקט נופים שלב א בבית שאן', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['nof-hayarden', 'd42bfc_886d6606485c42e8abf4b3852dc977e3~mv2.jpg', 'פרויקט נוף הירדן בבית שאן', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['eilon', 'd42bfc_e821180af866476e864dc9866c279af4~mv2.jpg', 'פרויקט אילון באקליפטוס בבית שאן', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['ariel', 'd42bfc_652635dc9c784157bc68e7f0da4429bd~mv2.jpg', 'הדמיית פרויקט אריאל באקליפטוס בבית שאן', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['nof-zemer', 'd42bfc_2b37024a1b4749b084f5101f84716f48~mv2.jpg', 'הדמיית פרויקט נוף זמר בחיפה', 'https://www.yigal-group.com/פרויקטים-שהסתיימו'],
  ['logo', 'd42bfc_1fdeaf185b004a44b37cb6358b387a01~mv2.png', 'קבוצת יגאל בוחבוט', 'https://www.yigal-group.com/'],
  ['logo-vertical', 'd42bfc_3e28077d5b3447c1978e882aac37cdf0~mv2.png', 'קבוצת יגאל בוחבוט — סמל', 'https://www.yigal-group.com/'],
  ['eyal-logo', 'd42bfc_dcba2dc7d5a541038a5807c6adcd83cd~mv2.png', 'אייל SEVEN7', 'https://www.yigal-group.com/services-5'],
];
await mkdir(path.join(root,'content'),{recursive:true});
await mkdir(path.join(root,'public/images'),{recursive:true});
const manifest={};
for(const [key,file,alt,sourcePage] of items){
  const sourceUrl=origin+file;
  const response=await fetch(sourceUrl);
  if(!response.ok) throw new Error(`${key}: ${response.status}`);
  const input=Buffer.from(await response.arrayBuffer());
  const metadata=await sharp(input).metadata();
  const localPath=`/images/${key}.webp`;
  await sharp(input).resize({width:key.includes('logo')?900:1920,withoutEnlargement:true}).webp({quality:84}).toFile(path.join(root,'public',localPath));
  const output=await sharp(path.join(root,'public',localPath)).metadata();
  manifest[key]={localPath,sourceUrl,sourcePage,alt,width:output.width,height:output.height,sourceWidth:metadata.width,sourceHeight:metadata.height};
  console.log(`${key}: ${output.width}x${output.height}`);
}
await writeFile(path.join(root,'content/assets.json'),JSON.stringify(manifest,null,2)+'\n');
await mkdir(path.join(root,'public/fonts'),{recursive:true});
const fonts={
  'assistant-hebrew.woff2':'https://fonts.gstatic.com/s/assistant/v24/2sDcZGJYnIjSi6H75xkzamW5O7w.woff2',
  'assistant-latin.woff2':'https://fonts.gstatic.com/s/assistant/v24/2sDcZGJYnIjSi6H75xkzaGW5.woff2',
  'manrope-latin.woff2':'https://fonts.gstatic.com/s/manrope/v23/xn7gYHE41ni1AdIRggexSg.woff2',
};
for(const [name,url] of Object.entries(fonts)){
  const r=await fetch(url); if(!r.ok)throw new Error(`${name}: ${r.status}`);
  await writeFile(path.join(root,'public/fonts',name),Buffer.from(await r.arrayBuffer()));
}
const logoUrl='https://static.wixstatic.com/media/d42bfc_1fdeaf185b004a44b37cb6358b387a01~mv2.png/v1/fill/w_397,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%D7%A7%D7%91%D7%95%D7%A6%D7%AA%20%D7%99%D7%92%D7%90%D7%9C%20%D7%91%D7%95%D7%97%D7%91%D7%95%D7%98%20-%20%D7%A9%D7%95%D7%9B%D7%91.png';
const logoResponse=await fetch(logoUrl);if(!logoResponse.ok)throw new Error(`group-logo: ${logoResponse.status}`);
await sharp(Buffer.from(await logoResponse.arrayBuffer())).png().toFile(path.join(root,'public/images/group-logo.png'));
manifest['group-logo']={localPath:'/images/group-logo.png',sourceUrl:logoUrl,sourcePage:'https://www.yigal-group.com/',alt:'קבוצת יגאל בוחבוט',width:397,height:61};
await writeFile(path.join(root,'content/assets.json'),JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(root,'content/fonts.json'),JSON.stringify(fonts,null,2)+'\n');
