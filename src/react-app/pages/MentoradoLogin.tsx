import { useState } from 'react';
import { ArrowRight, Shield, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useMentoradoAuth } from '../providers/MentoradoAuthProvider';

function MentoradoLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useMentoradoAuth();
  

  const handleDirectAccess = async () => {
    setLoading(true);
    try {
      // Login direto com credenciais demo
      await login('mentorado@demo.com', '111111');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Missão China PRO</h1>
          <p className="text-gray-600">Acesso exclusivo para mentorados</p>
        </div>

        <Card className="p-8 shadow-lg border-0">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Exclusivo</h2>
              <p className="text-gray-600 text-sm">
                Sistema de gestão para mentorados do programa Missão China PRO
              </p>
            </div>

            <Button
              onClick={handleDirectAccess}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Acessando...
                </div>
              ) : (
                <>
                  <User className="mr-2 h-5 w-5" />
                  Acessar Área Mentorado
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 mb-1">Recursos incluídos:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Dashboard de negócios e métricas</li>
                    <li>• Gestão de fornecedores chineses</li>
                    <li>• Acompanhamento de deals</li>
                    <li>• Documentação e relatórios</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MentoradoLogin;
