/**
 * Verified FAQs for Hotel Carlton
 * 
 * Truth Rules:
 * Each answer states only confirmed facts or advises contacting the hotel directly
 * (phone: 0581 257 4049).
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    id: "faq-checkin",
    question: "What are the standard check-in and check-out times?",
    answer: "Standard check-in and check-out schedules vary based on the day's arrivals. Please contact the hotel reception directly at 0581 257 4049 to confirm exact timing or to request early arrival / late departure."
  },
  {
    id: "faq-parking",
    question: "Is vehicular parking available on the property?",
    answer: "Yes, Hotel Carlton provides on-site parking on the premises for guests and visitors traveling by car."
  },
  {
    id: "faq-food",
    question: "Is food and dining service available for resident guests?",
    answer: "Yes, food and dining service is available for resident guests. Please contact the front desk to confirm current menu options and service timing."
  },
  {
    id: "faq-wifi",
    question: "Is Wi-Fi provided in rooms and public areas?",
    answer: "Yes, wireless internet (Wi-Fi) is available for guests across the hotel premises and within guest rooms."
  },
  {
    id: "faq-laundry",
    question: "Does the hotel offer laundry and pressing services?",
    answer: "Yes, laundry and garment pressing services are available for resident guests upon request at reception."
  },
  {
    id: "faq-room-service",
    question: "Is room service available?",
    answer: "Yes, room service is available for in-room refreshments and dining during the hotel's kitchen operating hours."
  },
  {
    id: "faq-booking",
    question: "How do I make a reservation or check current availability?",
    answer: "You can request availability directly through our online enquiry form, or speak with our reservations desk directly by calling 0581 257 4049."
  }
];
