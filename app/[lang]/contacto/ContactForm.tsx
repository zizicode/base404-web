'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';
import styles from './page.module.scss';

interface ContactFormProps {
  locale: Locale;
  contact: Record<string, string>;
}

export default function ContactForm({ locale, contact }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular éxito (90% de probabilidad)
    if (Math.random() > 0.1) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.title}>{contact.title}</h1>
          <p className={styles.subtitle}>{contact.subtitle}</p>

          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              <h2>{contact.successTitle}</h2>
              <p>{contact.successBody}</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              <h2>{contact.errorTitle}</h2>
              <p>{contact.errorBody}</p>
            </div>
          )}

          {submitStatus !== 'success' && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  {contact.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={contact.namePlaceholder}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  {contact.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={contact.emailPlaceholder}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="subject" className={styles.label}>
                  {contact.subjectLabel}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={contact.subjectPlaceholder}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="message" className={styles.label}>
                  {contact.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={contact.messagePlaceholder}
                  required
                  rows={6}
                  className={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                {isSubmitting ? '...' : contact.submitBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}