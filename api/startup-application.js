// Vercel Node Function: write Startup Pack leads to Holos CRM using server-only credentials.
// Required: HOLOS_CRM_API_URL (https://trusted-host/api/v1) and HOLOS_CRM_API_KEY.
// Never place the key in VITE_ variables; fail closed when unconfigured.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));}
function validOrigin(req){
  const origin=req.headers.origin;
  if(!origin) return true;
  try{
    const o=new URL(origin);
    return o.protocol==='https:' && (o.hostname==='xopsconference.com'||o.hostname.endsWith('.xopsconference.com')||o.hostname==='www.xopsconference.com') ||
      (process.env.NODE_ENV!=='production' && o.hostname==='localhost');
  }catch{return false;}
}
export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{error:'method_not_allowed'});}
  if(!validOrigin(req))return json(res,403,{error:'invalid_origin'});
  const base=process.env.HOLOS_CRM_API_URL;
  const key=process.env.HOLOS_CRM_API_KEY;
  if(!base||!key)return json(res,503,{error:'crm_not_configured'});
  let u;
  try{u=new URL(base);if(u.protocol!=='https:'||u.username||u.password)throw Error('Invalid CRM API URL');}
  catch{return json(res,503,{error:'crm_url_invalid'});}
  const d=typeof req.body==='object'&&req.body!==null?req.body:{};
  const str=(v,max=255)=>typeof v==='string'?v.trim().slice(0,max):'';
  const email=str(d.email,255).toLowerCase();
  const firstName=str(d.firstName,100),lastName=str(d.lastName,100);
  if(!EMAIL.test(email)||!firstName||!lastName||!str(d.companyName)||!str(d.website)||!str(d.jobTitle))return json(res,422,{error:'invalid_application'});
  const details={
    companyName:str(d.companyName),website:str(d.website,500),country:str(d.country),cities:str(d.city),
    employees:str(String(d.employees??'')),category:str(d.category),productDescription:str(d.productDesc,3000),
    arrBand:str(d.stage),foundedDate:str(d.foundedDate),documentation:str(d.docType),
    newsletterConsent:d.newsletterConsent===true,privacyNoticeVersion:str(d.privacyNoticeVersion,20),
    submittedAt:new Date().toISOString()
  };
  const payload={
    email,first_name:firstName,last_name:lastName,job_title:str(d.jobTitle,200),
    linkedin_url:str(d.linkedin,500)||null,lifecycle_stage:'lead',source:'xops_startup_pack',
    tags:JSON.stringify(['xopsconference','startup-pack',...str(d.city).split(',').map(x=>x.trim()).filter(Boolean)]),
    notes:JSON.stringify(details)
  };
  const endpoint=new URL(u.toString().replace(/\/$/,'')+'/contacts');
  if(!endpoint.pathname.includes('/api/v1/contacts'))return json(res,503,{error:'crm_api_url_must_include_api_v1'});
  try{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
    let r;
    try{r=await fetch(endpoint,{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});}
    finally{clearTimeout(timer);}
    if(r.status===409)return json(res,409,{error:'already_registered',message:'Contact already exists; please contact info@xopsconference.com'});
    if(!r.ok)return json(res,502,{error:'crm_unavailable'});
    return json(res,201,{success:true});
  }catch{return json(res,502,{error:'crm_unavailable'});}
}
