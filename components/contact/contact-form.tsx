'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MagicBento } from '@/components/ui/magic-bento';

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
          result.message ||
            'Failed to deliver message. Please reach out via email directly.'
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
      <div className="w-full">
        <MagicBento
          items={[
            {
              id: 'form-submitted-card',
              colSpan: 1,
              content: (
                <div className="select-text w-full py-10 px-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Message Received
                  </h3>
                  <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you for getting in touch, {formData.name || 'there'}. I have received your message and will review it shortly.
                  </p>
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          subject: 'Internship Opportunity',
                          message: '',
                        });
                      }}
                      className="cursor-pointer font-mono text-xs rounded-full"
                    >
                      Send another message
                    </Button>
                  </div>
                </div>
              ),
            },
          ]}
          columns={1}
          rowHeight={320}
          glowColor="#2563eb"
          enableBorderGlow={true}
          enableSpotlight={true}
          spotlightRadius={300}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect={false}
          enableStars={false}
          theme="light"
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <MagicBento
        items={[
          {
            id: 'contact-form-bento',
            colSpan: 1,
            content: (
              <div className="select-text w-full p-1 sm:p-2 space-y-4">
                <div className="space-y-1 pb-1 border-b border-border/60">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    Send a Message
                  </h3>
                  <p className="text-xs text-muted">
                    Direct inquiry regarding projects, internships, or engineering discussions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold">{errorMessage}</p>
                        <p className="text-[11px] text-red-700">
                          Direct email:{' '}
                          <a
                            href="mailto:ferrynoerhendriawan18@gmail.com"
                            className="underline font-mono text-red-800 font-medium"
                          >
                            ferrynoerhendriawan18@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-[11px] font-mono uppercase tracking-wider text-muted">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Name or Organization"
                        className="bg-surface-raised border-border rounded-xl text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[11px] font-mono uppercase tracking-wider text-muted">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@example.com"
                        className="bg-surface-raised border-border rounded-xl text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-[11px] font-mono uppercase tracking-wider text-muted">
                      Inquiry Type
                    </Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="flex h-9 w-full rounded-xl border border-border bg-surface-raised px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent transition-colors cursor-pointer select-none"
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
                    <Label htmlFor="message" className="text-[11px] font-mono uppercase tracking-wider text-muted">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Briefly describe your project, timeline, or engineering opportunity..."
                      className="bg-surface-raised border-border rounded-xl min-h-[95px] text-xs"
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
              </div>
            ),
          },
        ]}
        columns={1}
        rowHeight={470}
        gap={0}
        glowColor="#2563eb"
        enableBorderGlow={true}
        enableSpotlight={true}
        spotlightRadius={300}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={false}
        enableStars={false}
        theme="light"
        className="w-full"
      />
    </div>
  );
}
