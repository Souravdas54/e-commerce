import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../components/home/home';
import Nextpart from '../components/nextpart/nextpart';

import Signup from '../auth/signup/register';
import Signin from '../auth/signin/login';

import Header from '../sharemodule/navbar/navbar';
import Appbar from '../sharemodule/navbar/appbar';

import DogProductsPage from '../components/dogtoys/dtoys';
import FishProductsPage from '../components/fishtoys/fishpage';
import CatProductsPage from '../components/cat/cattyos';
import BirdProductsPage from '../components/birds/bird';

const Approuter = () => {
  return (
    <Router>
      <Header />
      <Appbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/nextpart' element={<Nextpart />} />

        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Signin />} />

        <Route path='/dtoys' element={<DogProductsPage />} />
        <Route path='/fishpage' element={<FishProductsPage />} />
        <Route path='/cattyos' element={<CatProductsPage />} />
        <Route path='/bird' element={<BirdProductsPage />} />

        {/* Default redirect to signup if no route matches */}
        {/* <Route path="*" element={<Navigate to="/signup" replace />} /> */}
      </Routes>
    </Router>

  )
}

export default Approuter