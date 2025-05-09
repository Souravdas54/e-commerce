import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Signup from '../auth/signup/register';
import Signin from '../auth/signin/login';

const Approuter = () => {
  return (
   <Router>
    <Routes>
      <Route path='/' element={<Signup/>}/>
      <Route path='/login' element={<Signin/>}/>



       {/* Default redirect to signup if no route matches */}
       <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
   </Router>
   
  )
}

export default Approuter