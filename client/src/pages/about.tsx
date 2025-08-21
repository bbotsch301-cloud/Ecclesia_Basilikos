import HeroSection from "@/components/ui/hero-section";
import ScriptureQuote from "@/components/ui/scripture-quote";
import { Check, X } from "lucide-react";

export default function About() {
  return (
    <div className="pt-16">
      <HeroSection
        title="About the New Covenant Trust"
        description="Understanding Christ as Grantor and us as beneficiaries in the divine trust relationship"
        backgroundImage="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
      />

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Ancient scrolls representing covenant documents" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-6">Christ as the Grantor</h2>
              <p className="text-lg text-covenant-gray leading-relaxed mb-6">
                The New Covenant Trust is established by Jesus Christ Himself as the Grantor, who has transferred all authority and blessing to His Body. Unlike Babylon's system of contracts and merchandise, this trust operates under divine law and spiritual authority.
              </p>
              <div className="bg-covenant-light p-6 rounded-lg">
                <blockquote className="font-georgia text-lg italic text-covenant-dark-gray mb-3">
                  "But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Hebrews 8:6</cite>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Broken chains symbolizing freedom from bondage" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div className="lg:order-1">
              <h2 className="font-playfair text-3xl font-bold text-covenant-blue mb-6">Contrast with Babylon's System</h2>
              <p className="text-lg text-covenant-gray leading-relaxed mb-6">
                Babylon operates through contracts, legal fictions, and the creation of artificial persons to bind mankind in debt slavery. The New Covenant Trust transcends these earthly systems, operating under the perfect law of liberty found in Christ.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <X className="text-red-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <span className="text-covenant-gray">Babylon: Legal fiction, artificial persons, debt slavery</span>
                </div>
                <div className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <span className="text-covenant-gray">Covenant: Living souls, divine inheritance, spiritual freedom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scriptural Foundation */}
          <div className="bg-covenant-blue p-12 rounded-2xl">
            <h3 className="font-playfair text-3xl font-bold text-white mb-8 text-center">Scriptural Foundation</h3>
            <p className="text-white text-center mb-8 text-lg">
              The New Covenant Trust is established upon the sure foundation of God's Word, as revealed in the King James Version of the Holy Bible.
            </p>
            
            <div className="space-y-8">
              {/* The Promise of the New Covenant */}
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h4 className="font-playfair text-xl font-bold text-covenant-gold mb-4">The Promise of the New Covenant</h4>
                <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                  "Behold, the days come, saith the LORD, that I will make a new covenant with the house of Israel, and with the house of Judah: Not according to the covenant that I made with their fathers in the day that I took them by the hand to bring them out of the land of Egypt; which my covenant they brake, although I was an husband unto them, saith the LORD: But this shall be the covenant that I will make with the house of Israel; After those days, saith the LORD, I will put my law in their inward parts, and write it in their hearts; and will be their God, and they shall be my people."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Jeremiah 31:31-33</cite>
              </div>

              {/* Spiritual Transformation */}
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h4 className="font-playfair text-xl font-bold text-covenant-gold mb-4">Spiritual Transformation</h4>
                <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                  "A new heart also will I give you, and a new spirit will I put within you: and I will take away the stony heart out of your flesh, and I will give you an heart of flesh. And I will put my spirit within you, and cause you to walk in my statutes, and ye shall keep my judgments, and do them."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Ezekiel 36:26-27</cite>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Christ's Blood Covenant */}
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h4 className="font-playfair text-lg font-bold text-covenant-gold mb-4">Christ's Blood Covenant</h4>
                  <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                    "Likewise also the cup after supper, saying, This cup is the new testament in my blood, which is shed for you."
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">Luke 22:20</cite>
                </div>

                {/* Ministers of the New Testament */}
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h4 className="font-playfair text-lg font-bold text-covenant-gold mb-4">Ministers of the New Testament</h4>
                  <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                    "Who also hath made us able ministers of the new testament; not of the letter, but of the spirit: for the letter killeth, but the spirit giveth life."
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">2 Corinthians 3:6</cite>
                </div>

                {/* Jesus as Surety */}
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h4 className="font-playfair text-lg font-bold text-covenant-gold mb-4">Jesus as Surety</h4>
                  <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                    "By so much was Jesus made a surety of a better testament."
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">Hebrews 7:22</cite>
                </div>

                {/* Better Promises */}
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <h4 className="font-playfair text-lg font-bold text-covenant-gold mb-4">Better Promises</h4>
                  <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                    "But now hath he obtained a more excellent ministry, by how much also he is the mediator of a better covenant, which was established upon better promises. For if that first covenant had been faultless, then should no place have been sought for the second. For finding fault with them, he saith, Behold, the days come, saith the Lord, when I will make a new covenant with the house of Israel and with the house of Judah: Not according to the covenant that I made with their fathers in the day when I took them by the hand to lead them out of the land of Egypt; because they continued not in my covenant, and I regarded them not, saith the Lord. For this is the covenant that I will make with the house of Israel after those days, saith the Lord; I will put my laws into their mind, and write them in their hearts: and I will be to them a God, and they shall be to me a people."
                  </blockquote>
                  <cite className="text-covenant-gold font-semibold">Hebrews 8:6-10</cite>
                </div>
              </div>

              {/* The Mediator and Eternal Inheritance */}
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h4 className="font-playfair text-xl font-bold text-covenant-gold mb-4">The Mediator and Eternal Inheritance</h4>
                <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                  "And for this cause he is the mediator of the new testament, that by means of death, for the redemption of the transgressions that were under the first testament, they which are called might receive the promise of eternal inheritance."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Hebrews 9:15</cite>
              </div>

              {/* The Covenant Written in Hearts */}
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h4 className="font-playfair text-xl font-bold text-covenant-gold mb-4">The Covenant Written in Hearts</h4>
                <blockquote className="font-georgia text-white mb-3 leading-relaxed">
                  "This is the covenant that I will make with them after those days, saith the Lord, I will put my laws into their hearts, and in their minds will I write them; And their sins and iniquities will I remember no more."
                </blockquote>
                <cite className="text-covenant-gold font-semibold">Hebrews 10:16-17</cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
