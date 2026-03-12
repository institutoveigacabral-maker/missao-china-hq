import { Pricing } from '../components/Pricing';
import { DollarSign, TrendingUp, Shield, Zap, Target, Award } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    price: '99',
    yearlyPrice: '79',
    period: 'mês',
    features: [
      'Até 100 SKUs cadastrados',
      'Análise básica de compliance',
      'Dashboard de métricas essenciais',
      'Acesso ao banco de fornecedores',
      'Suporte por email',
      'Relatórios mensais',
    ],
    description: 'Perfeito para começar sua operação na China',
    buttonText: 'Começar Agora',
    href: '/mentorado/login',
    isPopular: false,
  },
  {
    name: 'Professional',
    price: '299',
    yearlyPrice: '239',
    period: 'mês',
    features: [
      'SKUs ilimitados',
      'Análise avançada de compliance',
      'Dashboard completo com IA',
      'Banco de fornecedores premium',
      'Suporte prioritário 24/7',
      'Relatórios semanais personalizados',
      'Consultoria mensal incluída',
      'Acesso à Canton Fair Network',
      'Ferramentas de negociação',
    ],
    description: 'Para empresas que levam a China a sério',
    buttonText: 'Experimentar Grátis',
    href: '/mentorado/login',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: '999',
    yearlyPrice: '799',
    period: 'mês',
    features: [
      'Tudo do Professional',
      'API dedicada',
      'White label disponível',
      'Gerente de conta dedicado',
      'Consultoria semanal ilimitada',
      'Treinamento da equipe',
      'Auditoria de fornecedores',
      'Missões personalizadas na China',
      'SLA garantido',
    ],
    description: 'Solução completa para grandes operações',
    buttonText: 'Falar com Vendas',
    href: '/mentorado/login',
    isPopular: false,
  },
];

const features = [
  {
    icon: DollarSign,
    title: 'Cash Out Garantido',
    description: 'Processos otimizados para maximizar seus lucros em operações China-Brasil',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: TrendingUp,
    title: 'ROI Comprovado',
    description: 'Clientes reportam aumento médio de 35% nas margens de lucro',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Shield,
    title: 'Compliance Total',
    description: 'Sistema de compliance integrado garante segurança em todas as operações',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Zap,
    title: 'Automação Inteligente',
    description: 'IA reduz tempo de processamento em até 70%',
    gradient: 'from-yellow-500 to-orange-600',
  },
  {
    icon: Target,
    title: 'Precisão nas Negociações',
    description: 'Dados em tempo real para tomar as melhores decisões',
    gradient: 'from-red-500 to-rose-600',
  },
  {
    icon: Award,
    title: 'Suporte Especializado',
    description: 'Time com mais de 15 anos de experiência em comércio China-Brasil',
    gradient: 'from-indigo-500 to-blue-600',
  },
];

export default function CashOut() {
  return (
    <div className="min-h-screen -mx-6 -my-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-16 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent-100 text-accent-800 px-4 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
              <Zap className="w-4 h-4" />
              Sistema de Cash Out Profissional
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Maximize seus lucros com
              <span className="block bg-gradient-to-r from-accent-600 via-purple-600 to-accent-700 bg-clip-text text-transparent mt-2">
                Operações China-Brasil
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Plataforma completa de gestão e compliance para importadores que querem escalar suas operações com segurança e rentabilidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:from-accent-700 hover:to-accent-800 transform hover:scale-105 transition-all duration-200">
                Começar Teste Grátis
              </button>
              <button className="px-8 py-4 bg-white text-accent-700 rounded-xl font-bold text-lg shadow-md hover:shadow-xl border-2 border-accent-200 hover:border-accent-400 transform hover:scale-105 transition-all duration-200">
                Agendar Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { value: '500+', label: 'Empresas ativas' },
                { value: '35%', label: 'Aumento médio de margem' },
                { value: '$50M+', label: 'Em importações gerenciadas' },
                { value: '98%', label: 'Taxa de aprovação' },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-accent-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">
              Recursos desenvolvidos especificamente para o mercado China-Brasil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border-2 border-slate-200 hover:border-accent-300 hover:shadow-2xl transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <Pricing 
          plans={pricingPlans}
          title="Planos Simples e Transparentes"
          description="Escolha o plano ideal para o tamanho da sua operação. Todos incluem 14 dias de teste grátis."
        />
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Empresas que confiam em nós
            </h2>
            <p className="text-slate-600 text-lg mb-12">
              Veja o que nossos clientes têm a dizer
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "Conseguimos reduzir nossos custos operacionais em 40% e aumentar as margens em 35% no primeiro ano.",
                  author: "João Silva",
                  role: "CEO",
                  company: "ImportBrasil LTDA, São Paulo",
                },
                {
                  quote: "O sistema de compliance nos salvou de problemas que teriam custado centenas de milhares de reais.",
                  author: "Maria Santos",
                  role: "Diretora de Operações",
                  company: "TechImport",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 hover:border-accent-300 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="text-5xl text-accent-400 mb-4 font-serif">"</div>
                  <p className="text-slate-700 mb-6 text-lg italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t-2 border-slate-200 pt-4">
                    <p className="font-bold text-slate-900 text-lg">{testimonial.author}</p>
                    <p className="text-sm text-slate-600 font-medium">{testimonial.role}</p>
                    <p className="text-xs text-slate-500 mt-1">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-accent-700 via-accent-800 to-purple-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Pronto para aumentar seus lucros?
          </h2>
          <p className="text-xl text-accent-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Junte-se a centenas de empresas que já estão maximizando seus resultados com nossa plataforma.
          </p>
          <button className="px-12 py-5 bg-white text-accent-700 rounded-xl font-black text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2">
            Começar Teste Grátis de 14 Dias
            <Zap className="w-5 h-5" />
          </button>
          <p className="text-accent-200 text-sm mt-6 font-medium">
            Não precisa cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </section>

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
