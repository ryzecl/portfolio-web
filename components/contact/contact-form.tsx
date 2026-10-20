'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Internship Opportunity',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="py-12 text-center space-y-4 animate-in fade-in bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-zinc-900">
          Message Received
        </h4>
        <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
          Thank you for reaching out, {formData.name || 'there'}. I have received your message and will review it shortly.
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
          className="text-xs font-mono text-zinc-900 font-semibold hover:underline pt-2 cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium"
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
            placeholder="Alex Morgan"
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors shadow-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium"
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
            placeholder="alex@company.com"
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="subject"
          className="block text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium"
        >
          Subject
        </label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors shadow-xs"
        >
          <option value="Internship Opportunity">
            Internship Opportunity
          </option>
          <option value="Client Project Inquiry">
            Client Project Inquiry
          </option>
          <option value="Technical Collaboration">
            Technical Collaboration
          </option>
          <option value="General Question">General Question</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="block text-xs font-mono text-zinc-500 uppercase tracking-wider font-medium"
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
          placeholder="Hi Ferry, I'd like to discuss an opportunity..."
          className="w-full bg-white border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors resize-none shadow-xs"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={loading}
        className="w-full rounded-xl"
      >
        {loading ? (
          <span>Sending...</span>
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
