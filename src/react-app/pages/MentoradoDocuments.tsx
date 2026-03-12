import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Trash2,
  File,
  Image,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Document {
  id: string;
  type: string;
  url: string;
  hash: string;
  created_at: number;
  updated_at: number;
  file_size?: number;
  file_name?: string;
}

function MentoradoDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentorado/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const result = await response.json();
      setDocuments(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', getDocumentType(file.name));

      const response = await fetch('/api/mentorado-documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mentorado_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      await fetchDocuments();
      event.target.value = ''; // Reset input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/mentorado-documents/${document.id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mentorado_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name || `document-${document.id}`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      const response = await fetch(`/api/mentorado-documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mentorado_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const getDocumentType = (fileName: string): string => {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf': return 'contract';
      case 'doc':
      case 'docx': return 'commitment';
      case 'xls':
      case 'xlsx': return 'invoice';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'qa_report';
      default: return 'other';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract': return File;
      case 'commitment': return FileText;
      case 'qa_report': return Image;
      case 'invoice': return FileSpreadsheet;
      default: return FileText;
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'contract': return 'Contrato';
      case 'commitment': return 'Termo de Compromisso';
      case 'qa_report': return 'Relatório QA';
      case 'invoice': return 'Fatura';
      default: return 'Outro';
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'contract': return 'primary';
      case 'commitment': return 'success';
      case 'qa_report': return 'warning';
      case 'invoice': return 'info';
      default: return 'secondary';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = (doc.file_name || doc.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-gray-600 mt-1">Gerencie seus documentos e contratos</p>
        </div>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <Button
            disabled={uploading}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? 'Enviando...' : 'Enviar Documento'}</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total de Documentos</p>
              <p className="text-2xl font-bold text-blue-900">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Contratos</p>
              <p className="text-2xl font-bold text-green-900">
                {documents.filter(d => d.type === 'contract').length}
              </p>
            </div>
            <File className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Relatórios QA</p>
              <p className="text-2xl font-bold text-purple-900">
                {documents.filter(d => d.type === 'qa_report').length}
              </p>
            </div>
            <Image className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Este Mês</p>
              <p className="text-2xl font-bold text-orange-900">
                {documents.filter(d => {
                  const docDate = new Date(d.created_at);
                  const now = new Date();
                  return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
              >
                <option value="all">Todos os Tipos</option>
                <option value="contract">Contratos</option>
                <option value="commitment">Termos de Compromisso</option>
                <option value="qa_report">Relatórios QA</option>
                <option value="invoice">Faturas</option>
                <option value="other">Outros</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        </Card>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documents.length === 0 ? 'Nenhum documento encontrado' : 'Nenhum documento corresponde aos filtros'}
            </h3>
            <p className="text-gray-600 mb-6">
              {documents.length === 0 
                ? 'Faça upload do seu primeiro documento'
                : 'Tente ajustar os filtros para encontrar documentos'
              }
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => {
              const IconComponent = getDocumentIcon(document.type);
              return (
                <Card key={document.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">
                          {document.file_name || `Documento ${document.id}`}
                        </h3>
                        <Badge variant={getDocumentColor(document.type) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'} size="sm">
                          {getDocumentLabel(document.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span>{new Date(document.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {document.file_size && (
                      <div className="flex justify-between">
                        <span>Tamanho:</span>
                        <span>{formatFileSize(document.file_size)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Hash:</span>
                      <span className="font-mono text-xs truncate max-w-20">
                        {document.hash.substring(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(document.url, '_blank')}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Ver</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(document)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentoradoDocuments;
