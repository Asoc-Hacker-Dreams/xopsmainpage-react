// Official Media Partners — X-Ops Dubai 2026.
// Reciprocal media-partnership agreements: each partner promotes/lists X-Ops
// Dubai 2026 (listing, social posts, newsletter, press) and we show their logo
// with a backlink to their official website here.
// Confirmed via info@xopsconference.com threads (Oct–Nov 2026):
// - Security Middle East (agreed 29 Oct 2026; media pack + deliverables received)
// - CoinNewsSpan (accepted by both sides 28 Oct 2026; VAP Group)
// - Times Of AI (accepted by us 4 Nov 2026; VAP Group)
// CryptoMoonPress is intentionally NOT listed: accepting it (and any event
// passes) is pending an explicit decision — kanban xops t_3c503efd.
// Backlinks use each outlet's canonical domain (for Security Middle East the
// canonical is securitymiddleeastmag.com; securitymiddleeastonline.com serves
// the same site but currently has a broken TLS certificate).
import securityMiddleEastLogo from '../assets/media-partners/security-middle-east.png';
import coinNewsSpanLogo from '../assets/media-partners/coinnewsspan.svg';
import timesOfAiLogo from '../assets/media-partners/times-of-ai.svg';

export const dubaiMediaPartners2026 = [
  {
    id: 'security-middle-east',
    name: 'Security Middle East',
    url: 'https://securitymiddleeastmag.com/',
    logo: securityMiddleEastLogo,
  },
  {
    id: 'coinnewsspan',
    name: 'CoinNewsSpan',
    url: 'https://www.coinnewsspan.com/',
    logo: coinNewsSpanLogo,
  },
  {
    id: 'times-of-ai',
    name: 'Times Of AI',
    url: 'https://www.timesofai.com/',
    logo: timesOfAiLogo,
  },
];
