import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <div className="text-covenant-gold text-4xl mb-4">
        {icon}
      </div>
      <h3 className="font-playfair text-2xl font-semibold text-covenant-blue mb-4">{title}</h3>
      <p className="text-covenant-gray leading-relaxed">
        {description}
      </p>
    </div>
  );
}
