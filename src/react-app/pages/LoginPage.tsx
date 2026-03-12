import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight, Shield, Zap, Globe, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('demo_token');
      const user = localStorage.getItem('demo_user');
      
      if (token && user) {
        navigate('/', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = () => {
    const demoUser = {
      id: 'user_demo',
      email: 'admin@chinahq.com',
      name: 'China HQ Admin',
      avatar: null,
      role: 'admin'
    };
    
    localStorage.setItem('demo_token', 'demo-jwt-token');
    localStorage.setItem('demo_user', JSON.stringify(demoUser));
    
    window.location.href = '/';
  };

  const handleDemoAccess = () => {
    navigate('/mentorado/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08),transparent_50%)]" />
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight">
              Missão China HQ
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Plataforma executiva completa para gestão estratégica de operações China ↔ Brasil/Portugal
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: 'Compliance Total',
                description: 'Gestão completa de regulamentações e certificações',
                color: 'from-blue-500 to-cyan-600'
              },
              {
                icon: Zap,
                title: 'Automação Inteligente',
                description: 'Análise automática de SKUs e fornecedores',
                color: 'from-emerald-500 to-green-600'
              },
              {
                icon: Globe,
                title: 'Alcance Global',
                description: 'Suporte para Brasil, Portugal e mercados internacionais',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-slate-200 transition-all duration-300"
              >
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="p-8 sm:p-10 shadow-2xl bg-white/95 backdrop-blur-sm border-2 border-slate-200">
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4 lg:hidden">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Entrar na conta</h2>
              <p className="text-slate-600">Use sua conta Google para acessar o sistema</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Continuar com Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">ou</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mt-0.5 shadow-md">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      Você é um mentorado?
                    </p>
                    <Button
                      onClick={handleDemoAccess}
                      variant="secondary"
                      size="sm"
                      className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
                    >
                      Acesse o sistema exclusivo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-slate-500 pt-2">
                Ao fazer login, você concorda com nossos <span className="text-blue-600 hover:underline cursor-pointer">Termos de Serviço</span> e <span className="text-blue-600 hover:underline cursor-pointer">Política de Privacidade</span>
              </p>
            </div>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              Sistema de autenticação OAuth2 seguro com Google
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
