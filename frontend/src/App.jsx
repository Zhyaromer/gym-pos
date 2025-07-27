import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import MembershipCheck from './Pages/MembershipCheck'
import AddMember from './Pages/AddMember'
import AddEmployee from './Pages/AddEmployee'
import Employee from './Pages/Employee'
import Selling from './Pages/Selling'
import Inventory from './Pages/Inventory'
import Pricing from './Pages/Pricing'
import PoolTickets from './Pages/PoolTickets'
import Expenses from './Pages/Expenses'
import AddingExpenses from './Pages/AddingExpenses'
import ProfitAnalysisPage from './Pages/Profit'
import CostsAnalysisPage from './Pages/Report'
import Recptioin from './Pages/Recptioin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/membership-check" element={
            <ProtectedRoute>
              <MembershipCheck />
            </ProtectedRoute>
          } />
          <Route path="/AddMember" element={
            <ProtectedRoute>
              <AddMember />
            </ProtectedRoute>
          } />
          <Route path="/AddEmployee" element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute>
              <Employee />
            </ProtectedRoute>
          } />
          <Route path="/selling" element={
            <ProtectedRoute>
              <Selling />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          } />
          <Route path="/pooltickets" element={
            <ProtectedRoute>
              <PoolTickets />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } />
          <Route path="/addingexpenses" element={
            <ProtectedRoute>
              <AddingExpenses />
            </ProtectedRoute>
          } />
          <Route path="/profit" element={
            <ProtectedRoute>
              <ProfitAnalysisPage />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              <CostsAnalysisPage />
            </ProtectedRoute>
          } />
          <Route path="/recptioin" element={
            <ProtectedRoute>
              <Recptioin />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;