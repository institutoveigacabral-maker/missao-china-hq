import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import { PrivateRoute } from './components/PrivateRoute';
import { DemoAuthProvider } from './components/DemoAuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import { LoadingProvider } from './providers/LoadingProvider';
import Layout from './components/Layout';

// Feature pages
import MissaoChinaPro from './pages/MissaoChinaPro';
import PlaybookTechnical from './pages/PlaybookTechnical';
import Regulations from './pages/Regulations';
import Suppliers from './pages/Suppliers';
import SkuManagement from './pages/SkuManagement';
import Finance from './pages/Finance';
import Incoterms from './pages/Incoterms';
import Logistics from './pages/Logistics';
import WfoeStructure from './pages/WfoeStructure';
import RiskRegister from './pages/RiskRegister';
import CantonFair from './pages/CantonFair';
import { SkuCrudDemo } from './pages/SkuCrudDemo';
import SpinnerDemo from './pages/SpinnerDemo';
import CashOut from './pages/CashOut';

// Mentorado system imports
import { MentoradoAuthProvider } from './providers/MentoradoAuthProvider';
import MentoradoLogin from './pages/MentoradoLogin';
import MentoradoDashboard from './pages/MentoradoDashboard';
import MentoradoProfile from './pages/MentoradoProfile';
import MentoradoDeals from './pages/MentoradoDeals';
import MentoradoSuppliers from './pages/MentoradoSuppliers';
import MentoradoSupplierDetail from './pages/MentoradoSupplierDetail';
import MentoradoDocuments from './pages/MentoradoDocuments';
import MentoradoReports from './pages/MentoradoReports';
import MentoradoAnalytics from './pages/MentoradoAnalytics';
import MentoradoDealNew from './pages/MentoradoDealNew';
import MentoradoDealDetail from './pages/MentoradoDealDetail';
import MentoradoDealEdit from './pages/MentoradoDealEdit';
import MentoradoLayout from './components/MentoradoLayout';
import { MentoradoProtectedRoute } from './components/MentoradoProtectedRoute';

function App() {
  return (
    <DemoAuthProvider>
      <MentoradoAuthProvider>
        <ToastProvider>
          <LoadingProvider>
            <Routes>
              {/* Public authentication routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Mentorado system - standalone */}
              <Route path="/mentorado" element={<MentoradoLogin />} />
              <Route path="/mentorado/login" element={<MentoradoLogin />} />
              <Route path="/mentorado/dashboard" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoDashboard /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/profile" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoProfile /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/deals" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoDeals /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/deals/new" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoDealNew /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/deals/:id" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoDealDetail /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/deals/:id/edit" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoDealEdit /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/suppliers" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoSuppliers /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/suppliers/:id" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoSupplierDetail /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/documents" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoDocuments /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/reports" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoReports /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              <Route path="/mentorado/analytics" element={
                <MentoradoProtectedRoute>
                  <MentoradoLayout><MentoradoAnalytics /></MentoradoLayout>
                </MentoradoProtectedRoute>
              } />
              
              {/* Main protected application routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Home />} />
                <Route path="missao-china-pro" element={<MissaoChinaPro />} />
                <Route path="playbook" element={<PlaybookTechnical />} />
                <Route path="regulations" element={<Regulations />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="skus" element={<SkuManagement />} />
                <Route path="finance" element={<Finance />} />
                <Route path="incoterms" element={<Incoterms />} />
                <Route path="logistics" element={<Logistics />} />
                <Route path="wfoe-structure" element={<WfoeStructure />} />
                <Route path="risk-register" element={<RiskRegister />} />
                <Route path="canton-fair" element={<CantonFair />} />
                <Route path="sku-crud" element={<SkuCrudDemo />} />
                <Route path="spinner-demo" element={<SpinnerDemo />} />
                <Route path="cash-out" element={<CashOut />} />
              </Route>
            </Routes>
          </LoadingProvider>
        </ToastProvider>
      </MentoradoAuthProvider>
    </DemoAuthProvider>
  );
}

export default App;
