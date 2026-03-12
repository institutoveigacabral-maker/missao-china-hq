import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Globe, TrendingDown, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export default function Finance() {
  const [selectedCountry, setSelectedCountry] = useState('brazil');
  const [fobValue, setFobValue] = useState<number>(1000);
  const [exchangeRate, setExchangeRate] = useState<number>(5.2);
  const [calculatedCosts, setCalculatedCosts] = useState({
    cif: 0,
    duties: 0,
    taxes: 0,
    total: 0,
    breakdown: {
      freight: 0,
      insurance: 0,
      ii: 0,
      ipi: 0,
      pis: 0,
      cofins: 0,
      icms: 0,
      vat: 0
    }
  });

  const countries = [
    { id: 'brazil', name: 'Brasil', flag: '🇧🇷', currency: 'R$' },
    { id: 'portugal', name: 'Portugal', flag: '🇵🇹', currency: '€' }
  ];

  useEffect(() => {
    const freight = fobValue * 0.08;
    const insurance = fobValue * 0.005;
    const cif = fobValue + freight + insurance;
    
    let duties = 0;
    let taxes = 0;
    let breakdown = {
      freight,
      insurance,
      ii: 0,
      ipi: 0,
      pis: 0,
      cofins: 0,
      icms: 0,
      vat: 0
    };

    if (selectedCountry === 'brazil') {
      const ii = cif * 0.14;
      const ipi = (cif + ii) * 0.10;
      const pis = (cif + ii + ipi) * 0.021;
      const cofins = (cif + ii + ipi) * 0.0965;
      const icms = (cif + ii + ipi + pis + cofins) * 0.18;
      
      breakdown.ii = ii;
      breakdown.ipi = ipi;
      breakdown.pis = pis;
      breakdown.cofins = cofins;
      breakdown.icms = icms;
      
      duties = ii;
      taxes = ipi + pis + cofins + icms;
    } else {
      const euDuty = cif * 0.06;
      const vat = (cif + euDuty) * 0.23;
      
      breakdown.ii = euDuty;
      breakdown.vat = vat;
      
      duties = euDuty;
      taxes = vat;
    }

    const total = cif + duties + taxes;

    setCalculatedCosts({
      cif: cif * exchangeRate,
      duties: duties * exchangeRate,
      taxes: taxes * exchangeRate,
      total: total * exchangeRate,
      breakdown: {
        freight: breakdown.freight * exchangeRate,
        insurance: breakdown.insurance * exchangeRate,
        ii: breakdown.ii * exchangeRate,
        ipi: breakdown.ipi * exchangeRate,
        pis: breakdown.pis * exchangeRate,
        cofins: breakdown.cofins * exchangeRate,
        icms: breakdown.icms * exchangeRate,
        vat: breakdown.vat * exchangeRate
      }
    });
  }, [selectedCountry, fobValue, exchangeRate]);

  const currentCountry = countries.find(c => c.id === selectedCountry);
  const margin = ((calculatedCosts.total - (fobValue * exchangeRate)) / (fobValue * exchangeRate)) * 100;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Cálculo de Impostos</h1>
                  <p className="text-emerald-100 text-sm">Landed Cost Calculator</p>
                </div>
              </div>
              <p className="text-lg text-emerald-100 mb-6 max-w-2xl">
                Calcule custos totais e tributação para importações China → Brasil/Portugal
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                  <span>Múltiplas Moedas</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Globe className="w-4 h-4" />
                  <span>Brasil & Portugal</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tempo Real</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-6xl font-bold text-white mb-2">{currentCountry?.currency}</div>
              <div className="text-emerald-100 text-lg">Moeda Local</div>
              <div className="text-sm text-emerald-200 mt-1">
                Taxa: {exchangeRate.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector */}
      <div className="grid grid-cols-2 gap-4">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => setSelectedCountry(country.id)}
            className={`group p-6 rounded-2xl border-3 transition-all duration-300 ${
              selectedCountry === country.id
                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl scale-105'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:scale-102'
            }`}
          >
            <div className="text-5xl mb-3 transition-transform group-hover:scale-110">{country.flag}</div>
            <div className="font-bold text-lg text-gray-900 mb-1">{country.name}</div>
            <div className="text-sm text-gray-600">Destino de importação</div>
            {selectedCountry === country.id && (
              <div className="mt-3 flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Selecionado
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Valor FOB</h3>
                <p className="text-sm text-gray-600">Em dólares americanos (USD)</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
              <input
                type="number"
                value={fobValue}
                onChange={(e) => setFobValue(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold bg-gray-50 focus:bg-white transition-all"
                placeholder="Digite o valor FOB"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Taxa de Câmbio</h3>
                <p className="text-sm text-gray-600">USD para {currentCountry?.currency}</p>
              </div>
            </div>
            <input
              type="number"
              step="0.01"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold bg-gray-50 focus:bg-white transition-all"
              placeholder="Taxa de câmbio"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Results */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor CIF</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentCountry?.currency} {calculatedCosts.cif.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Impostos Importação</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentCountry?.currency} {calculatedCosts.duties.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingDown className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tributos Internos</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentCountry?.currency} {calculatedCosts.taxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Globe className="h-6 w-6 text-emerald-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Custo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentCountry?.currency} {calculatedCosts.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Calculator className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Detalhamento Completo</h3>
              <p className="text-sm text-gray-600">Estrutura tributária - {currentCountry?.name}</p>
            </div>
          </div>
          
          {selectedCountry === 'brazil' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Composição CIF */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-blue-600 rounded" />
                    Composição CIF
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">FOB (Base)</span>
                      <span className="font-bold text-blue-900">R$ {(fobValue * exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">+ Frete (8%)</span>
                      <span className="font-bold text-blue-900">R$ {calculatedCosts.breakdown.freight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">+ Seguro (0.5%)</span>
                      <span className="font-bold text-blue-900">R$ {calculatedCosts.breakdown.insurance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t-2 border-blue-300 flex justify-between items-center">
                      <span className="font-semibold text-blue-900">= CIF Total</span>
                      <span className="font-bold text-lg text-blue-900">R$ {calculatedCosts.cif.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Tributos */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-red-600 rounded" />
                    Tributos Federais
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 font-medium">II - Imposto de Importação (14%)</span>
                        <span className="font-bold text-red-900">R$ {calculatedCosts.breakdown.ii.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-700 font-medium">IPI (10%)</span>
                        <span className="font-bold text-orange-900">R$ {calculatedCosts.breakdown.ipi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700 font-medium">PIS (2.1%)</span>
                        <span className="font-bold text-yellow-900">R$ {calculatedCosts.breakdown.pis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-amber-700 font-medium">COFINS (9.65%)</span>
                        <span className="font-bold text-amber-900">R$ {calculatedCosts.breakdown.cofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-700 font-medium">ICMS (18%)</span>
                        <span className="font-bold text-purple-900">R$ {calculatedCosts.breakdown.icms.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">Custo Total Landed</h4>
                      <p className="text-sm text-gray-600">Valor final incluindo todos os custos e tributos</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-emerald-700">
                        R$ {calculatedCosts.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium mt-1">
                        Margem: +{margin.toFixed(1)}% sobre FOB
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <Info className="w-4 h-4" />
                    <span>Este é o valor que chegará ao destino final, incluindo todos os custos de importação</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Composição CIF */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-blue-600 rounded" />
                    Composição CIF
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">FOB (Base)</span>
                      <span className="font-bold text-blue-900">€ {(fobValue * exchangeRate).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">+ Frete (8%)</span>
                      <span className="font-bold text-blue-900">€ {calculatedCosts.breakdown.freight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">+ Seguro (0.5%)</span>
                      <span className="font-bold text-blue-900">€ {calculatedCosts.breakdown.insurance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t-2 border-blue-300 flex justify-between items-center">
                      <span className="font-semibold text-blue-900">= CIF Total</span>
                      <span className="font-bold text-lg text-blue-900">€ {calculatedCosts.cif.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Tributos UE */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-purple-600 rounded" />
                    Tributos EU/Portugal
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-blue-700 font-medium">Direitos Aduaneiros (6%)</span>
                        <span className="font-bold text-blue-900">€ {calculatedCosts.breakdown.ii.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-700 font-medium">IVA - Portugal (23%)</span>
                        <span className="font-bold text-purple-900">€ {calculatedCosts.breakdown.vat.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">Custo Total Landed</h4>
                      <p className="text-sm text-gray-600">Valor final incluindo todos os custos e tributos</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-emerald-700">
                        € {calculatedCosts.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium mt-1">
                        Margem: +{margin.toFixed(1)}% sobre FOB
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <Info className="w-4 h-4" />
                    <span>Este é o valor que chegará ao destino final, incluindo todos os custos de importação</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Considerações Brasil</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>AFRMM pode ser aplicável para transporte marítimo</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Antidumping pode incidir em produtos específicos</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Licenças de importação necessárias para alguns produtos</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Regras de origem afetam alíquotas preferenciais</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Considerações Portugal/EU</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Possibilidade de VAT Warehouse diferido</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Regimes especiais para entrepostos aduaneiros</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Certificados de origem podem reduzir tarifas</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Conformidade CE obrigatória para alguns produtos</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
