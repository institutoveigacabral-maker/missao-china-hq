import { X } from 'lucide-react';
import SkuDetailCard from './SkuDetailCard';

interface SkuDetailModalProps {
  sku: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export default function SkuDetailModal({ sku, isOpen, onClose, onEdit }: SkuDetailModalProps) {
  if (!isOpen || !sku) return null;

  return (
    <>
      {/* Backdrop - z-49 */}
      <div className="fixed inset-0 bg-black/50 z-49 flex items-center justify-center p-4">
        {/* Modal - z-50 */}
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Detalhes do SKU: {sku.sku_code}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6">
              <SkuDetailCard 
                sku={sku} 
                isExpanded={true}
                onEdit={onEdit}
                className="border-0 shadow-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onEdit();
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar SKU
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
