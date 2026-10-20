'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Internship Opportunity',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key:
            process.env.NEXT_PUBLIC_WEB3FORMS_KEY ||
            '22850c15-9843-4a16-a079-44371a863d40',
          name: formData.name,
          email: formData.email,
          subject: `[Portfolio Inquiry] ${formData.subject} · ${formData.name}`,
          message: formData.message,
          from_name: 'Ferry Portfolio Contact Form',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          result.message || 'Failed to deliver message. Please reach out via email directly.'
        );
      }
    } catch {
      setErrorMessage(
        'Network error encountered. Please check your connection or contact me via email directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-4 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-foreground">
          Message Received
        </h4>
        <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
          Thank you for getting in touch, {formData.name || 'there'}. I have received your message and will review it shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              subject: 'Internship Opportunity',
              message: '',
            });
          }}
          className="text-xs font-mono text-accent font-semibold hover:underline pt-2 cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-[11px] text-red-300">
              Direct email:{' '}
              <a
                href="mailto:ferrynoerhendriawan18@gmail.com"
                className="underline font-mono text-red-200"
              >
                ferrynoerhendriawan18@gmail.com
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-mono text-muted uppercase tracking-wider font-medium"
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Name or Organization"
            className="w-full bg-surface-raised border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-mono text-muted uppercase tracking-wider font-medium"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="name@example.com"
            className="w-full bg-surface-raised border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="subject"
          className="block text-xs font-mono text-muted uppercase tracking-wider font-medium"
        >
          Inquiry Type
        </label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="w-full bg-surface-raised border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        >
          <option value="Internship Opportunity" className="bg-surface text-foreground">
            Internship Opportunity
          </option>
          <option value="Client Project Inquiry" className="bg-surface text-foreground">
            Client Project Inquiry
          </option>
          <option value="Technical Collaboration" className="bg-surface text-foreground">
            Technical Collaboration
          </option>
          <option value="General Inquiry" className="bg-surface text-foreground">
            General Inquiry
          </option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-xs font-mono text-muted uppercase tracking-wider font-medium"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Briefly describe your project or opportunity..."
          className="w-full bg-surface-raised border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={loading}
        className="w-full rounded-xl cursor-pointer"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Delivering message...</span>
          </span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Send Message</span>
          </>
        )}
      </Button>
    </form>
  );
}
