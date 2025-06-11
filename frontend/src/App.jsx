import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import MembershipCheck from './Pages/MembershipCheck'
import AddMember from './Pages/AddMember'
import AddEmployee from './Pages/AddEmployee'
import Employee from './Pages/Employee'
import SalaryPayments from './Pages/SalaryPayments'
import Selling from './Pages/Selling'
import Inventory from './Pages/Inventory'
import AddInventory from './Pages/AddInventory'
import Attendence from './Pages/Attendence'
import Pricing from './Pages/Pricing'
import PoolTickets from './Pages/PoolTickets'
import Expenses from './Pages/Expenses'
import AddingExpenses from './Pages/AddingExpenses'
import ProfitAnalysisPage from './Pages/Profit'
import CostsAnalysisPage from './Pages/Report'
import Recptioin from './Pages/Recptioin';

{/* resturant routes */ }

import A from './Pages/resturant/A';
import R_AddEmployee from './Pages/resturant/AddEmployee';
import R_AddingExpenses from './Pages/resturant/AddingExpenses';
import R_AddInventory from './Pages/resturant/AddInventory';
import R_Attendence from './Pages/resturant/Attendence';
import R_Dashboard from './Pages/resturant/Dashboard';
import R_Expenses from './Pages/resturant/Expenses';
import R_Employee from './Pages/resturant/Employee';
import R_Inventory from './Pages/resturant/Inventory';
import R_Login from './Pages/resturant/Login';
import R_Profit from './Pages/resturant/Profit';
import R_Recptioin from './Pages/resturant/Recptioin';
import R_SalaryPayments from './Pages/resturant/SalaryPayments';
import R_Selling from './Pages/resturant/Selling';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/membership-check" element={<MembershipCheck />} />
        <Route path="/AddMember" element={<AddMember />} />
        <Route path="/AddEmployee" element={<AddEmployee />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/salarypayments" element={<SalaryPayments />} />
        <Route path="/selling" element={<Selling />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/addinventory" element={<AddInventory />} />
        <Route path="/attendence" element={<Attendence />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pooltickets" element={<PoolTickets />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/addingexpenses" element={<AddingExpenses />} />
        <Route path="/profit" element={<ProfitAnalysisPage />} />
        <Route path="/report" element={<CostsAnalysisPage />} />
        <Route path="/recptioin" element={<Recptioin />} />

        {/* resturant routes */}

        <Route path="/R" element={<R_Login />} />
        <Route path="/R_main" element={<A />} />
        <Route path="/R_dashboard" element={<R_Dashboard />} />
        <Route path="/R_employees" element={<R_Employee />} />
        <Route path="/R_AddEmployee" element={<R_AddEmployee />} />
        <Route path="/R_salarypayments" element={<R_SalaryPayments />} />
        <Route path="/R_selling" element={<R_Selling />} />
        <Route path="/R_inventory" element={<R_Inventory />} />
        <Route path="/R_addinventory" element={<R_AddInventory />} />
        <Route path="/R_attendence" element={<R_Attendence />} />
        <Route path="/R_expenses" element={<R_Expenses />} />
        <Route path="/R_addingexpenses" element={<R_AddingExpenses />} />
        <Route path="/R_profit" element={<R_Profit />} />
        <Route path="/R_recptioin" element={<R_Recptioin />} />
      </Routes>
    </Router>
  )
}

export default App;