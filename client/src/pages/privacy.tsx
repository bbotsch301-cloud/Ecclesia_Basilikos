import { Link } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Privacy() {
  usePageTitle("Privacy Policy");
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-playfair text-4xl font-bold text-royal-navy mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: February 2026</p>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Account Information:</strong> When you become a Beneficiary, we collect your name, email address,
              and password (stored securely using bcrypt hashing).
            </li>
            <li>
              <strong>Usage Data:</strong> We collect information about how you use the Platform, including
              pages visited, courses accessed, and forum activity.
            </li>
            <li>
              <strong>Contact Information:</strong> When you use our contact form, we collect your name,
              email, and message content.
            </li>
            <li>
              <strong>Newsletter Subscriptions:</strong> If you subscribe to our newsletter, we collect
              your email address.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Administer your beneficial interest and trust operations</li>
            <li>Send verification emails and password reset links</li>
            <li>Deliver newsletter updates you have subscribed to</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Track course progress and enrollment</li>
            <li>Improve the Platform based on usage patterns</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">3. Data Storage and Security</h2>
          <p>
            Your data is stored in a secure PostgreSQL database. Passwords are hashed using bcrypt and never
            stored in plain text. Sessions are managed securely with HTTP-only cookies. We implement
            Content Security Policy headers and CSRF protection to guard against common web attacks.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">4. Cookies</h2>
          <p>
            We use essential cookies for session management and authentication. These cookies are necessary
            for the Platform to function properly. We also use a CSRF token cookie to protect against
            cross-site request forgery attacks. We do not use advertising or third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">5. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google Fonts:</strong> For typography (loads fonts from Google servers)</li>
            <li><strong>Font Awesome:</strong> For icons (loaded from CDN)</li>
            <li><strong>Gmail SMTP:</strong> For sending verification and notification emails</li>
            <li><strong>YouTube/Vimeo:</strong> For embedded video content</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">6. Data Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties. Your data is held within the private trust structure and is only shared with third-party services as described above, which are necessary for the Platform to function.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access and update your personal information through your profile</li>
            <li>Withdraw your beneficial interest (account deletion)</li>
            <li>Unsubscribe from our newsletter at any time</li>
            <li>Request a copy of your personal data</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">Private Association Data Practices</h2>
          <p>
            As a Private Membership Association, Ecclesia Basilikos handles all member data within the private
            jurisdiction of the Trust. Data collected from Beneficiaries is used exclusively for the administration
            of beneficial interest and trust operations. The Association does not participate in commercial data
            markets or advertising networks.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">9. Children's Privacy</h2>
          <p>
            The Platform is not intended for children under the age of 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with
            an updated revision date. Your continued use of the Platform constitutes acceptance of the
            revised policy.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">11. Contact</h2>
          <p>
            If you have questions about this Privacy Policy or your personal data, please{" "}
            <Link href="/contact" className="text-royal-gold hover:text-royal-gold-bright underline">
              contact us
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
