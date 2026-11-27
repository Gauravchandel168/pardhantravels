import { cookies } from 'next/headers';
import type { Lang } from './util';

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  return c.get('lang')?.value === 'hi' ? 'hi' : 'en';
}

const en = {
  nav: { cars: 'Our cars', fares: 'Fare calculator', routes: 'Routes', tours: 'Tours', reviews: 'Reviews', contact: 'Contact', call: 'Call' },
  hero: {
    eyebrow: 'Taxi service in Ambala · {years} years of experience',
    h1a: 'Cabs from Ambala,', h1b: 'booked in two minutes.',
    sub: 'One-way, round trip, airport drops and tours. Sedan, SUV and every type of car, with verified drivers and fares you can see before you book.',
    book: 'Book your cab', fares: 'See fares',
  },
  form: {
    title: 'Book your cab', tripType: 'Trip type', oneWay: 'One-way', roundTrip: 'Round trip', airport: 'Airport', local: 'Local',
    pickup: 'Pickup', drop: 'Drop', date: 'Date', time: 'Time', car: 'Car type', name: 'Your name', mobile: 'Mobile number',
    bookNow: 'Book now', whatsapp: 'Chat on WhatsApp', sending: 'Sending…', estimate: 'Estimated fare',
    error: 'Booking could not be sent. Call or WhatsApp us instead.', invalid: 'Enter a valid mobile number.',
    note: 'We confirm your fare on WhatsApp. Toll and parking are extra.',
    tourTitle: 'Plan your own trip', destination: 'Destination', days: 'Number of days', people: 'Number of people', plan: 'Plan my trip',
  },
  trust: [
    ['Verified drivers', 'Background-checked, uniformed and polite.'],
    ['Clear fares', 'Per-km pricing, shown before you book.'],
    ['Clean AC cars', 'Cleaned before every trip.'],
    ['Open 24×7', 'Early flights and late returns covered.'],
  ],
  fleet: { title: 'Our cars', sub: 'Every type of car, for every kind of trip.', perKm: '/km' },
  fare: {
    badge: 'Fare calculator', title: 'Know your fare before you book.',
    sub: 'Pick a car and enter the distance. Toll, parking and state tax are extra, as per actuals.',
    distance: 'Distance (km, one way)', round: 'Round trip', estimated: 'Estimated fare', book: 'Book at this fare',
  },
  routes: { title: 'Popular routes from Ambala', from: 'Sedan from' },
  how: {
    title: 'How it works',
    steps: [
      ['Choose your trip', 'Pick pickup, drop, date and car type.'],
      ['Confirm on WhatsApp', 'We confirm the fare and share the driver and car details.'],
      ['Ride and pay', 'Your driver arrives on time. Pay by UPI or cash.'],
    ],
  },
  services: {
    tours: ['Tour packages', 'Shimla–Manali, Char Dham, Amritsar, Rajasthan. A car and driver for your whole trip.', 'View all packages →'],
    airport: ['Airport transfers', 'Delhi IGI and Chandigarh airport pickups and drops, timed to your flight.'],
    corp: ['Corporate and weddings', 'Monthly cab contracts for companies and car fleets for wedding guests.'],
  },
  reviews: { title: 'What our customers say', onGoogle: 'on Google', count: 'reviews' },
  faq: { title: 'Frequently asked questions' },
  visit: { title: 'Visit or call us', office: 'Office', phone: 'Phone and WhatsApp', email: 'Email', desk: 'Booking desk' },
  cta: { title: 'Planning a trip? Message us.', sub: 'Tell us where and when. We reply with the fare and car details.', whatsapp: 'WhatsApp us', call: 'Call now' },
  footer: { services: 'Services', servicesText: 'Outstation · Airport · Local · Tours · Corporate', explore: 'Explore', contact: 'Contact', rights: 'All rights reserved.' },
  route: {
    home: 'Home', routes: 'Routes', taxi: 'taxi', distance: 'Distance', time: 'Travel time', bookRoute: 'Book this route',
    faresTitle: 'Fares for', faresNote: 'Toll, parking and state tax are extra, as per actuals.',
    cols: ['Car', 'Seats', 'Rate', 'One way', 'Round trip'],
    includedTitle: 'Included in your fare', included: ['Driver and fuel', 'AC car, cleaned before the trip', 'Pickup from your doorstep'],
    extraTitle: 'Charged extra', extra: ['Toll and parking, as per actuals', 'State entry tax, where it applies'],
    other: 'Other routes from Ambala',
  },
  tours: {
    title: 'Tour packages from Ambala',
    sub: 'Book a car and driver for your whole trip. Pick a package or tell us your own plan. Hotel booking is coming soon.',
    nights: 'nights', days: 'days', carFare: 'Car fare', onRequest: 'Ask for price', enquire: 'Enquire',
    note: 'Packages are car and driver only. Hotels and meals are not included.',
    customSub: 'Tell us where you want to go, for how many days and how many people. We reply on WhatsApp with a plan and a price.',
  },
  thanks: {
    title: 'Booking request received', ref: 'Your reference is', soon: 'We will confirm on WhatsApp shortly.',
    summary: 'Trip summary', route: 'Route', pickup: 'Pickup', car: 'Car', fare: 'Estimated fare',
    next: 'What happens next',
    steps: ['We message you on WhatsApp to confirm the fare and pickup time.', 'You get the driver name, phone number and car number before pickup.', 'Pay by UPI or cash.'],
    chat: 'Chat on WhatsApp', home: 'Back to home',
  },
};

const hi: typeof en = {
  nav: { cars: 'हमारी गाड़ियाँ', fares: 'किराया कैलकुलेटर', routes: 'रूट', tours: 'टूर पैकेज', reviews: 'रिव्यू', contact: 'संपर्क', call: 'कॉल करें' },
  hero: {
    eyebrow: 'अंबाला में टैक्सी सेवा · {years} साल का अनुभव',
    h1a: 'अंबाला से कहीं भी,', h1b: 'दो मिनट में बुकिंग।',
    sub: 'वन-वे, राउंड ट्रिप, एयरपोर्ट ड्रॉप और टूर। सेडान, SUV और हर तरह की गाड़ी, वेरिफाइड ड्राइवर और बुकिंग से पहले साफ किराया।',
    book: 'कैब बुक करें', fares: 'किराया देखें',
  },
  form: {
    title: 'अपनी कैब बुक करें', tripType: 'ट्रिप का प्रकार', oneWay: 'वन-वे', roundTrip: 'राउंड ट्रिप', airport: 'एयरपोर्ट', local: 'लोकल',
    pickup: 'पिकअप', drop: 'ड्रॉप', date: 'तारीख', time: 'समय', car: 'गाड़ी का प्रकार', name: 'आपका नाम', mobile: 'मोबाइल नंबर',
    bookNow: 'अभी बुक करें', whatsapp: 'WhatsApp पर चैट करें', sending: 'भेजा जा रहा है…', estimate: 'अनुमानित किराया',
    error: 'बुकिंग नहीं भेजी जा सकी। हमें कॉल या WhatsApp करें।', invalid: 'सही मोबाइल नंबर डालिए।',
    note: 'किराया हम WhatsApp पर कन्फर्म करते हैं। टोल और पार्किंग अलग।',
    tourTitle: 'अपना ट्रिप खुद प्लान करें', destination: 'कहाँ जाना है', days: 'कितने दिन', people: 'कितने लोग', plan: 'मेरा ट्रिप प्लान करें',
  },
  trust: [
    ['वेरिफाइड ड्राइवर', 'बैकग्राउंड चेक, यूनिफॉर्म में और विनम्र।'],
    ['साफ किराया', 'प्रति किमी रेट, बुकिंग से पहले दिखता है।'],
    ['साफ AC गाड़ियाँ', 'हर ट्रिप से पहले सफाई।'],
    ['24×7 सेवा', 'सुबह की फ्लाइट और रात की वापसी भी।'],
  ],
  fleet: { title: 'हमारी गाड़ियाँ', sub: 'हर तरह की ट्रिप के लिए हर तरह की गाड़ी।', perKm: '/किमी' },
  fare: {
    badge: 'किराया कैलकुलेटर', title: 'बुकिंग से पहले किराया जानिए।',
    sub: 'गाड़ी चुनिए और दूरी डालिए। टोल, पार्किंग और स्टेट टैक्स असल के हिसाब से अलग लगेंगे।',
    distance: 'दूरी (किमी, एक तरफ)', round: 'राउंड ट्रिप', estimated: 'अनुमानित किराया', book: 'इस किराये पर बुक करें',
  },
  routes: { title: 'अंबाला से लोकप्रिय रूट', from: 'सेडान से शुरू' },
  how: {
    title: 'बुकिंग कैसे होती है',
    steps: [
      ['ट्रिप चुनिए', 'पिकअप, ड्रॉप, तारीख और गाड़ी चुनिए।'],
      ['WhatsApp पर कन्फर्म करें', 'हम किराया कन्फर्म करके ड्राइवर और गाड़ी की जानकारी भेजते हैं।'],
      ['सफर करें और भुगतान करें', 'ड्राइवर समय पर पहुँचेगा। UPI या कैश से भुगतान करें।'],
    ],
  },
  services: {
    tours: ['टूर पैकेज', 'शिमला–मनाली, चार धाम, अमृतसर, राजस्थान। पूरे सफर के लिए गाड़ी और ड्राइवर।', 'सभी पैकेज देखें →'],
    airport: ['एयरपोर्ट ट्रांसफर', 'दिल्ली IGI और चंडीगढ़ एयरपोर्ट, आपकी फ्लाइट के समय पर।'],
    corp: ['कॉर्पोरेट और शादी', 'कंपनियों के लिए मंथली कैब और शादी के मेहमानों के लिए गाड़ियाँ।'],
  },
  reviews: { title: 'हमारे ग्राहक क्या कहते हैं', onGoogle: 'Google पर', count: 'रिव्यू' },
  faq: { title: 'अक्सर पूछे जाने वाले सवाल' },
  visit: { title: 'हमसे मिलें या कॉल करें', office: 'ऑफिस', phone: 'फोन और WhatsApp', email: 'ईमेल', desk: 'बुकिंग डेस्क' },
  cta: { title: 'ट्रिप प्लान कर रहे हैं? हमें मैसेज करें।', sub: 'कहाँ और कब जाना है बताइए। हम किराया और गाड़ी की जानकारी भेज देंगे।', whatsapp: 'WhatsApp करें', call: 'अभी कॉल करें' },
  footer: { services: 'सेवाएँ', servicesText: 'आउटस्टेशन · एयरपोर्ट · लोकल · टूर · कॉर्पोरेट', explore: 'एक्सप्लोर', contact: 'संपर्क', rights: 'सर्वाधिकार सुरक्षित।' },
  route: {
    home: 'होम', routes: 'रूट', taxi: 'टैक्सी', distance: 'दूरी', time: 'सफर का समय', bookRoute: 'इस रूट को बुक करें',
    faresTitle: 'किराया:', faresNote: 'टोल, पार्किंग और स्टेट टैक्स असल के हिसाब से अलग।',
    cols: ['गाड़ी', 'सीट', 'रेट', 'वन-वे', 'राउंड ट्रिप'],
    includedTitle: 'किराये में शामिल', included: ['ड्राइवर और ईंधन', 'AC गाड़ी, ट्रिप से पहले साफ', 'आपके घर से पिकअप'],
    extraTitle: 'अलग से लगेगा', extra: ['टोल और पार्किंग, असल के हिसाब से', 'स्टेट एंट्री टैक्स, जहाँ लगता है'],
    other: 'अंबाला से अन्य रूट',
  },
  tours: {
    title: 'अंबाला से टूर पैकेज',
    sub: 'पूरे सफर के लिए गाड़ी और ड्राइवर बुक करें। पैकेज चुनिए या अपना प्लान बताइए। होटल बुकिंग जल्द आ रही है।',
    nights: 'रात', days: 'दिन', carFare: 'गाड़ी का किराया', onRequest: 'कीमत पूछें', enquire: 'पूछताछ करें',
    note: 'पैकेज सिर्फ गाड़ी और ड्राइवर के हैं। होटल और खाना शामिल नहीं है।',
    customSub: 'कहाँ जाना है, कितने दिन और कितने लोग, बताइए। हम WhatsApp पर प्लान और कीमत भेजेंगे।',
  },
  thanks: {
    title: 'बुकिंग रिक्वेस्ट मिल गई', ref: 'आपका रेफरेंस नंबर', soon: 'हम जल्द ही WhatsApp पर कन्फर्म करेंगे।',
    summary: 'ट्रिप की जानकारी', route: 'रूट', pickup: 'पिकअप', car: 'गाड़ी', fare: 'अनुमानित किराया',
    next: 'आगे क्या होगा',
    steps: ['हम WhatsApp पर किराया और पिकअप का समय कन्फर्म करेंगे।', 'पिकअप से पहले ड्राइवर का नाम, फोन और गाड़ी का नंबर मिल जाएगा।', 'UPI या कैश से भुगतान करें।'],
    chat: 'WhatsApp पर चैट करें', home: 'होम पर जाएँ',
  },
};

export type Dict = typeof en;
export const dict: Record<Lang, Dict> = { en, hi };
