import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { Switch } from './ui/Switch';
import { Badge } from './ui/Badge';
import Button from './ui/Button';

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = 'Planos Simples e Transparentes',
  description = 'Escolha o plano ideal para você',
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-accent-600 via-purple-600 to-accent-800 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center items-center gap-3 mb-12">
        <span className={`text-sm font-medium transition-colors ${isMonthly ? 'text-gray-900' : 'text-gray-500'}`}>
          Mensal
        </span>
        <Switch
          checked={!isMonthly}
          onCheckedChange={handleToggle}
        />
        <span className={`text-sm font-medium transition-colors ${!isMonthly ? 'text-gray-900' : 'text-gray-500'}`}>
          Anual <span className="text-accent-600">(Economize 20%)</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
              relative rounded-2xl border-2 p-8 bg-white
              transition-all duration-300 hover:shadow-2xl
              ${plan.isPopular 
                ? 'border-accent-600 shadow-xl scale-105 z-10' 
                : 'border-gray-200 hover:border-accent-300'
              }
            `}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="primary" className="px-4 py-1.5 text-sm font-semibold shadow-lg">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Mais Popular
                </Badge>
              </div>
            )}

            {/* Plan Content */}
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${isMonthly ? plan.price : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-500 text-sm">
                    / {plan.period}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {isMonthly ? 'Cobrado mensalmente' : 'Cobrado anualmente'}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-accent-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="space-y-3">
                <Button
                  variant={plan.isPopular ? 'primary' : 'secondary'}
                  fullWidth
                  className={`
                    py-3 text-base font-semibold
                    transform transition-all duration-200
                    hover:scale-105
                    ${plan.isPopular 
                      ? 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800' 
                      : ''
                    }
                  `}
                  onClick={() => window.location.href = plan.href}
                >
                  {plan.buttonText}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  {plan.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">
          Precisa de um plano personalizado para sua empresa?
        </p>
        <Button variant="ghost" className="text-accent-600 hover:text-accent-700">
          Fale com nosso time de vendas →
        </Button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
