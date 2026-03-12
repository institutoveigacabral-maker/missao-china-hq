import { 
  Users, 
  Briefcase, 
  Target,
  TrendingUp,
  Shield,
  Award,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function MissaoChinaPro() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section - Churchill Mood */}
      <div className="relative bg-gradient-to-br from-[#D62828] via-[#C41E1E] to-[#A01818] text-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent"></div>
        </div>
        
        <div className="relative px-8 py-16 md:px-16 md:py-20">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg mb-6">
              <span className="text-sm font-semibold tracking-wider uppercase">Programa Oficial v1.0</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Missão China PRO
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Programa internacional de imersão empresarial conectando Brasil–Portugal–China através de governança real, sourcing e IA aplicada (CÓRTEX³)
            </p>
            
            <div className="border-t border-white/20 pt-6 mt-6">
              <p className="text-lg font-medium italic text-white/80">
                "Churchill mood: Estratégia, Cadeia e Disciplina."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Autoridade & Contexto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#D62828]/10 rounded-lg">
              <Users className="h-8 w-8 text-[#D62828]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Henrique Lemos</h2>
              <p className="text-gray-600">Líder do Programa</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Expert em operações China-Brasil com experiência comprovada em sourcing, compliance internacional e estruturação de cadeias de suprimento.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-[#D62828]/10 rounded-lg">
              <Briefcase className="h-8 w-8 text-[#D62828]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Powered by</h2>
              <p className="text-gray-600">TÁLAMO × COMEX BCN</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Plataforma integrada de inteligência comercial e operacional desenvolvida para maximizar resultados em operações China-Brasil-Portugal.
          </p>
        </div>
      </div>

      {/* Arquitetura do Programa */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Target className="h-8 w-8 text-[#D62828] mr-3" />
          Arquitetura do Programa
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#D62828] rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="ml-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#D62828]">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Governança Real</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Estruturas societárias, compliance e frameworks regulatórios para operações China-Brasil-Portugal
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#D62828] rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="ml-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#D62828]">
              <h3 className="font-bold text-lg mb-3 text-gray-900">Sourcing Estratégico</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Identificação, qualificação e negociação com fornecedores OEM/ODM na Greater Bay Area
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#D62828] rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="ml-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#D62828]">
              <h3 className="font-bold text-lg mb-3 text-gray-900">IA Aplicada (CÓRTEX³)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plataforma de inteligência para análise de suppliers, compliance score e risk management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Experiência do Programa */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Calendar className="h-8 w-8 text-[#D62828] mr-3" />
          Experiência e Imersão
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#D62828] rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Canton Fair Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Participação guiada na maior feira de comércio da China, com acesso VIP a halls estratégicos, networking com fornecedores pré-qualificados e agenda personalizada
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#D62828] rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Factory Audits & QC</h3>
              <p className="text-gray-600 leading-relaxed">
                Visitas técnicas a fábricas selecionadas, auditorias de qualidade e validação de capacidade produtiva com metodologia internacional
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#D62828] rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2 text-gray-900">Workshops Executivos</h3>
              <p className="text-gray-600 leading-relaxed">
                Sessões intensivas sobre regulamentação, incoterms, estruturação tributária e negociação internacional com especialistas locais
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pacotes e Investimento */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <DollarSign className="h-8 w-8 text-[#D62828] mr-3" />
          Pacotes de Investimento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#D62828] transition-all duration-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Essential</h3>
              <div className="text-3xl font-extrabold text-[#D62828] mb-2">$4,900</div>
              <p className="text-sm text-gray-600">Por participante</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Canton Fair Pass (5 dias)</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Acesso CÓRTEX³ (30 dias)</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Workshop Compliance (4h)</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-[#D62828] rounded-xl p-6 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#D62828] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                Recomendado
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
              <div className="text-3xl font-extrabold text-[#D62828] mb-2">$8,900</div>
              <p className="text-sm text-gray-600">Por participante</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Tudo do Essential +</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Factory Visits (3 unidades)</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Kit Executivo Completo</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Acesso CÓRTEX³ (90 dias)</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#D62828] transition-all duration-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="text-3xl font-extrabold text-[#D62828] mb-2">$14,900</div>
              <p className="text-sm text-gray-600">Por participante</p>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Tudo do Professional +</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Consultoria M&A (20h)</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>WFOE Setup Guidance</span>
              </li>
              <li className="flex items-start">
                <Award className="h-5 w-5 text-[#D62828] mr-2 flex-shrink-0" />
                <span>Acesso CÓRTEX³ (12 meses)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kit Executivo */}
      <div className="bg-gradient-to-br from-[#D62828] to-[#A01818] text-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6">Kit Executivo Missão China PRO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold text-xl mb-4">Incluído no Kit</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Mala executiva premium com branding
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Fones noise-cancelling para viagens
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Playbook físico encadernado
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Cartões de visita bilíngues
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Acesso digital CÓRTEX³
              </li>
            </ul>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold text-xl mb-4">Materiais Digitais</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Templates de contrato internacional
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Calculadoras tributárias BR/PT
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Database de fornecedores verificados
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Checklists de compliance
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                Guias de negociação cultural
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* M&A e Exclusividades */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">M&A e Estruturação Corporativa</h2>
        
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-[#D62828]">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-[#D62828] rounded-full"></div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Due Diligence Completa</h3>
            <p className="text-gray-600 leading-relaxed">
              Análise profunda de alvos de aquisição, validação financeira e estrutural de operações China
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-[#D62828]">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-[#D62828] rounded-full"></div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">WFOE Setup & Structure</h3>
            <p className="text-gray-600 leading-relaxed">
              Estruturação de Wholly Foreign-Owned Enterprise com compliance total e otimização tributária
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-[#D62828]">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-[#D62828] rounded-full"></div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Exclusive Partnerships</h3>
            <p className="text-gray-600 leading-relaxed">
              Negociação de exclusividades territoriais e parcerias estratégicas de longo prazo
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-black text-white rounded-2xl shadow-2xl p-12 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-[#D62828]">
          Pronto para transformar sua operação internacional?
        </h2>
        <p className="text-xl mb-8 text-gray-300">
          Junte-se ao próximo grupo da Missão China PRO
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-[#D62828] hover:bg-[#C41E1E] text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
            Inscrever-se Agora
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 border border-white/20">
            Agendar Consultoria
          </button>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-sm text-gray-400">
            Powered by TÁLAMO × COMEX BCN | Programa oficial liderado por Henrique Lemos
          </p>
        </div>
      </div>

      {/* Nota de Rodapé Churchill */}
      <div className="text-center">
        <p className="text-lg font-medium italic text-gray-600">
          "Churchill mood: Estratégia, Cadeia e Disciplina."
        </p>
      </div>
    </div>
  );
}
