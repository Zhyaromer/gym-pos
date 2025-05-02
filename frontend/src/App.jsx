import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import MembershipCheck from './Pages/MembershipCheck'
import AddMember from './Pages/AddMember'
import AddEmployee from './Pages/AddEmployee'

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
      </Routes>
    </Router>
  )
}

export default App
