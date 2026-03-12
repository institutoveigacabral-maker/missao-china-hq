import { useState, useEffect } from 'react';
import { User, Building2, Phone, Mail, MapPin, Calendar, Save, Edit3 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  profile: {
    id: string;
    company: string;
    cnpj: string;
    phone: string;
    capital_brl: number;
    status: string;
    created_at: number;
  };
}

interface ProfileFormData {
  name: string;
  company: string;
  cnpj: string;
  phone: string;
  capital_brl: number;
}

function MentoradoProfile() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    company: '',
    cnpj: '',
    phone: '',
    capital_brl: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentorado/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();
      setProfileData(result.data);
      
      // Initialize form data
      setFormData({
        name: result.data.user.name,
        company: result.data.profile.company,
        cnpj: result.data.profile.cnpj,
        phone: result.data.profile.phone,
        capital_brl: result.data.profile.capital_brl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/mentorado/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mentorado_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.user.name,
        company: profileData.profile.company,
        cnpj: profileData.profile.cnpj,
        phone: profileData.profile.phone,
        capital_brl: profileData.profile.capital_brl,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'onboarding': return 'warning';
      case 'suspended': return 'error';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Perfil não encontrado</h2>
          <p className="text-gray-600">Não foi possível carregar os dados do perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e empresariais</p>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Editar</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleCancel}
                variant="secondary"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Salvar</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
            <Badge variant={getStatusColor(profileData.profile.status) as 'success' | 'warning' | 'error'}>
              {profileData.profile.status === 'active' ? 'Ativo' :
               profileData.profile.status === 'onboarding' ? 'Onboarding' : 'Suspenso'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profileData.user.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{profileData.user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profileData.profile.company}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="00.000.000/0000-00"
                  />
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{formatCNPJ(profileData.profile.cnpj)}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="+55 (11) 99999-9999"
                  />
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{profileData.profile.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capital Social
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.capital_brl}
                  onChange={(e) => setFormData({ ...formData, capital_brl: Number(e.target.value) })}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min="0"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{formatCurrency(profileData.profile.capital_brl)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Status Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Conta</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant={getStatusColor(profileData.profile.status) as 'success' | 'warning' | 'error'}>
                {profileData.profile.status === 'active' ? 'Ativo' :
                 profileData.profile.status === 'onboarding' ? 'Onboarding' : 'Suspenso'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Membro desde</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(profileData.profile.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tipo</span>
              <span className="text-sm font-medium text-gray-900">Mentorado PRO</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MentoradoProfile;
