import { Link } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function PmaAgreement() {
  usePageTitle("PMA Membership Agreement");
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-playfair text-4xl font-bold text-royal-navy mb-2">PMA Membership Agreement</h1>
      <p className="text-muted-foreground mb-4">Ecclesia Basilikos Private Membership Association</p>
      <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

      <div className="prose prose-slate max-w-none space-y-6">
        {/* Scripture Header */}
        <div className="bg-royal-navy text-white p-6 rounded-lg border-l-4 border-royal-gold mb-8">
          <p className="font-georgia italic text-center mb-2">
            "For where two or three are gathered together in my name, there am I in the midst of them."
          </p>
          <p className="text-royal-gold text-center font-semibold text-sm">— Matthew 18:20 (KJV)</p>
          <p className="font-georgia italic text-center mt-4 mb-2">
            "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people."
          </p>
          <p className="text-royal-gold text-center font-semibold text-sm">— 1 Peter 2:9 (KJV)</p>
        </div>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">1. Preamble</h2>
          <p>
            Ecclesia Basilikos is established as a Private Membership Association ("PMA") operating under the First Amendment
            right of free association and the free exercise of religion as guaranteed by the Constitution of the United States
            of America. This Association exists as a body of believers gathered in covenant fellowship, exercising their
            unalienable rights to associate privately for religious, educational, and charitable purposes.
          </p>
          <p>
            This PMA Membership Agreement ("Agreement") constitutes the governing document of the Association and establishes
            the terms upon which Beneficiaries acquire and maintain their beneficial interest in the Ecclesia Basilikos Trust.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>The Trust:</strong> Ecclesia Basilikos Trust, the organizational structure through which the Association operates and administers its corpus.</li>
            <li><strong>Grantor:</strong> Christ and the New Covenant, the source of divine authority under which the Trust operates.</li>
            <li><strong>Trustee:</strong> The administrator of the Ecclesia Basilikos Trust, responsible for the stewardship and management of the Trust corpus.</li>
            <li><strong>Beneficiary:</strong> Any individual who has voluntarily accepted this Agreement and thereby acquired beneficial interest in the Trust. Formerly referred to as a "member."</li>
            <li><strong>Beneficial Interest:</strong> The rights, privileges, and access granted to a Beneficiary through their participation in the Trust.</li>
            <li><strong>Private Jurisdiction:</strong> The internal governance structure of the Association, operating outside of public commercial jurisdiction.</li>
            <li><strong>Trust Corpus:</strong> The totality of assets administered by the Trust, including but not limited to: educational content, courses, downloadable resources, community forums, platform infrastructure, and financial contributions.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">3. Membership as Beneficial Interest</h2>
          <p>
            By accepting this Agreement, you acquire beneficial interest in the Ecclesia Basilikos Trust. This is not a
            commercial transaction but an act of voluntary association and trust participation.
          </p>
          <p>Beneficial interest is structured in two tiers:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>General Beneficial Interest (Free):</strong> Access to foundational Trust content, including the Trust pillar course, Trust-related downloads, forum reading, and educational resources.</li>
            <li><strong>PMA Beneficial Interest:</strong> Full access to all Trust corpus, including all courses, all downloadable templates and guides, forum posting and community discussion, Proof Vault document timestamping, comments on lessons and videos, and priority community support. The contribution for PMA Beneficial Interest is a trust contribution, not a commercial transaction.</li>
          </ul>
          <p>
            Each Beneficiary, regardless of tier, receives one (1) Beneficial Unit representing an equal and undivided
            share of the Trust corpus. The proportional interest is calculated dynamically as 1/N, where N equals the
            total number of active Beneficial Units issued.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">4. Rights of Beneficiaries</h2>
          <p>All Beneficiaries are entitled to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access to educational materials and courses as determined by their tier of beneficial interest</li>
            <li>Participation in the community forum in accordance with their tier</li>
            <li>Use of the Proof Vault for document timestamping (PMA Beneficiaries)</li>
            <li>Access to downloadable resources and templates as determined by their tier</li>
            <li>Enrollment in available courses and tracking of learning progress</li>
            <li>Receipt of one (1) Beneficial Unit instrument certifying their interest in the Trust</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">5. Obligations of Beneficiaries</h2>
          <p>By accepting this Agreement, each Beneficiary agrees to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Conduct themselves in accordance with the principles and values of the Trust</li>
            <li>Treat fellow Beneficiaries with respect and dignity in all interactions</li>
            <li>Not misrepresent Trust materials as legal, financial, or professional advice</li>
            <li>Maintain the confidentiality of private Association communications</li>
            <li>Not reproduce, distribute, or create derivative works from Trust content without express written permission from the Trustee</li>
            <li>Comply with the Platform Usage Guidelines that supplement this Agreement</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">6. Trustee's Duties & Authority</h2>
          <p>The Trustee is responsible for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Administration and stewardship of the Trust corpus</li>
            <li>Curation and development of educational content</li>
            <li>Management of Beneficiary membership and access</li>
            <li>Maintenance of the platform infrastructure through which beneficial interest is delivered</li>
            <li>Exercising fiduciary responsibility in all Trust operations</li>
          </ul>
          <p>
            The Trustee reserves the right to amend the terms of the Trust, modify the structure of beneficial interest,
            and make administrative decisions necessary for the proper functioning and protection of the Trust and its Beneficiaries.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">7. Private Jurisdiction</h2>
          <p>
            This Association operates in a private capacity and not as a public commercial enterprise. The activities
            conducted within this Association are private in nature and are protected by the First Amendment right of
            free association and the Fourteenth Amendment protections of the Constitution of the United States.
          </p>
          <p>
            By accepting this Agreement, each Beneficiary acknowledges that they are voluntarily entering into a private
            association and waive any claims against the Association under public commercial regulatory frameworks.
            All interactions, transactions, and communications within the Association are conducted in private jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">8. Educational Disclaimer</h2>
          <p>
            All content provided through the Ecclesia Basilikos Trust is for educational and informational purposes only.
            Nothing contained in the Trust corpus constitutes legal, financial, tax, or professional advice.
            Beneficiaries are strongly encouraged to consult with qualified professionals before making any decisions
            based on the information provided through the Trust.
          </p>
          <p>
            The Trust structure, beneficial interest framework, and associated terminology are presented for educational
            purposes to illustrate principles of trust law, covenant relationships, and scriptural governance.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">9. Dispute Resolution</h2>
          <p>
            Any disputes arising between Beneficiaries, or between a Beneficiary and the Trust, shall be resolved
            through the following process:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Internal Resolution:</strong> The matter shall first be brought to the Trustee for private resolution.</li>
            <li><strong>Scriptural Mediation:</strong> If internal resolution is not achieved, the matter shall be addressed through scriptural mediation in accordance with Matthew 18:15-17.</li>
            <li><strong>Good Faith Resolution:</strong> All parties agree to exhaust good faith resolution efforts before seeking any external remedy.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">10. Amendments & Severability</h2>
          <p>
            The Trustee may amend this Agreement at any time with reasonable notice to Beneficiaries. Continued
            participation in the Trust following notice of amendment constitutes acceptance of the amended terms.
          </p>
          <p>
            If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions
            shall continue in full force and effect. The invalid provision shall be modified to the minimum extent
            necessary to make it valid and enforceable while preserving the original intent.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-semibold text-royal-navy">11. Voluntary Acceptance</h2>
          <p>
            By digitally accepting this Agreement during registration, the Beneficiary affirms that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>They have read and understood this Agreement in its entirety</li>
            <li>They are voluntarily entering into this private association of their own free will</li>
            <li>They are of legal age to enter into this Agreement</li>
            <li>They understand that digital acceptance constitutes a binding agreement</li>
            <li>They acknowledge that membership constitutes the acquisition of beneficial interest in the Trust, not a commercial purchase</li>
          </ul>
        </section>

        <section className="border-t pt-6">
          <p className="text-sm text-gray-500">
            For questions about this Agreement, please{" "}
            <Link href="/contact" className="text-royal-gold hover:text-royal-gold-bright underline">
              contact the Trustee
            </Link>.
            See also our{" "}
            <Link href="/terms" className="text-royal-gold hover:text-royal-gold-bright underline">
              Platform Usage Guidelines
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-royal-gold hover:text-royal-gold-bright underline">
              Privacy Policy
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
