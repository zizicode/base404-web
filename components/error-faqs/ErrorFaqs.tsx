'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import styles from './ErrorFaqs.module.scss';

interface Faq {
  question: string;
  answer: string;
}

interface ErrorFaqsProps {
  title: string;
  faqs: Faq[];
}

export default function ErrorFaqs({ title, faqs }: ErrorFaqsProps) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section className={styles.section} aria-labelledby="faqs-heading">
      <h2 id="faqs-heading" className={styles.sectionTitle}>
        <HelpCircle size={18} aria-hidden="true" className={styles.iconPrimary} />
        {title}
      </h2>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqTrigger}
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className={styles.faqQ}>{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <p className={styles.faqA}>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
