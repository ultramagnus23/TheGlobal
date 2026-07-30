export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "There is no fixed minimum for dealers buying from stock. For bulk project orders, call us and we'll confirm quantities and pricing for your site.",
  },
  {
    question: "How long does delivery take to my district?",
    answer:
      "Most districts in Rajasthan receive dispatch within a few working days from our Jaipur warehouse, since we hold standing inventory rather than ordering in after your enquiry. Call us for a delivery estimate to your specific location.",
  },
  {
    question: "Do you supply outside Rajasthan?",
    answer:
      "Yes. Our Astral distribution and Somany dealership are based in Rajasthan, but we ship pan-India on request.",
  },
  {
    question: "What credit terms do you offer dealers?",
    answer: "Credit terms are agreed directly with our sales team based on your order history and volume. Call us to discuss.",
  },
  {
    question: "How do I become a dealer?",
    answer:
      "Submit an enquiry on our Become a Dealer page or call us directly. We'll discuss stock availability, margins and onboarding for your area.",
  },
  {
    question: "Do you handle government and infrastructure tenders?",
    answer:
      "Yes. We provide authorisation letters, GSTIN and other tender-grade documentation for government and infrastructure buyers — see our Downloads page or contact us directly.",
  },
];
