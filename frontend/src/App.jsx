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
        <Route path="/Aatendence" element={<Attendence />} />
      </Routes>
    </Router>
  )
}

export default App
