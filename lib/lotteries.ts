import source from '@/content/lotteries.json';
export type LotteryDocument={label:string;url:string;category?:string};
export type Lottery={id:string;complexId:string;sourceUrl:string;description:string;documents:LotteryDocument[];buildings:{id:string;apartments:{number:string;label:string;url:string}[]}[];floorPlans:LotteryDocument[]};
export const lotteries=source as Lottery[];
export function uniqueApartments<T extends {number:string;url:string}>(apartments:T[]):T[]{const seen=new Set<string>();return apartments.filter(a=>{const key=a.number+'|'+a.url;if(seen.has(key))return false;seen.add(key);return true})}
