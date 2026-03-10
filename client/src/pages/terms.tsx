import { Link } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Terms() {
  usePageTitle("Terms of Service");
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-playfair text-4xl font-bold text-royal-navy mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Ecclesia Basilikos platform ("the Platform"), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">2. Description of Service</h2>
          <p>
            Ecclesia Basilikos is an educational platform providing courses, resources, forum discussions, and
            downloadable materials related to Kingdom citizenship, biblical covenant truth, and trust administration.
            The content is provided for educational and informational purposes only.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">3. User Accounts</h2>
          <p>
            To access certain features, you must create an account. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities that occur under your account.
            You agree to provide accurate and complete information when creating your account and to update
            your information as necessary.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Post or transmit harmful, threatening, abusive, or defamatory content</li>
            <li>Attempt to gain unauthorized access to any part of the Platform</li>
            <li>Interfere with or disrupt the Platform or its servers</li>
            <li>Reproduce, distribute, or sell any content without authorization</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">5. Intellectual Property</h2>
          <p>
            All content on the Platform, including courses, videos, documents, and resources, is the property of
            Ecclesia Basilikos or its content creators and is protected by applicable intellectual property laws.
            You may not reproduce, distribute, or create derivative works from this content without express
            written permission.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">6. Forum and Community Guidelines</h2>
          <p>
            When participating in forum discussions, you agree to engage respectfully and constructively.
            We reserve the right to remove any content and suspend accounts that violate these guidelines.
            Content posted in forums represents the views of individual users and does not necessarily reflect
            the views of Ecclesia Basilikos.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">7. Disclaimer</h2>
          <p>
            The educational content provided on this Platform is for informational purposes only and does not
            constitute legal, financial, or professional advice. You should consult qualified professionals
            before making any decisions based on the information provided. The Platform is provided "as is"
            without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">8. Limitation of Liability</h2>
          <p>
            Ecclesia Basilikos shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the Platform or reliance on any content provided herein.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be effective
            immediately upon posting. Your continued use of the Platform after changes constitutes acceptance
            of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">10. Contact</h2>
          <p>
            If you have questions about these Terms of Service, please{" "}
            <Link href="/contact" className="text-royal-gold hover:text-royal-gold-bright underline">
              contact us
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
