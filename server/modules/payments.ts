import {assert} from '../lib/errors.ts';
export interface PaymentProvider {name:string;authorize(amount:number):Promise<{status:'Successful'|'Pending';reference:string}>}
class DevelopmentPaymentProvider implements PaymentProvider {name='development';async authorize(amount:number){assert(process.env.NODE_ENV!=='production',503,'Development payments are disabled in production');assert(Number.isInteger(amount)&&amount>=0,400,'Invalid amount');return {status:'Successful' as const,reference:`dev-${crypto.randomUUID()}`};}}
export function paymentProvider():PaymentProvider{assert(!process.env.PAYMENT_PROVIDER||process.env.PAYMENT_PROVIDER==='development',503,'Payment provider is not configured');return new DevelopmentPaymentProvider();}
