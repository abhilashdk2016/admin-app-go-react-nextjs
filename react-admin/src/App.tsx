import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';
import RedirectToUser from './components/RedirectToUser';
import Links from './pages/Links';
import Products from './pages/products/Products';
import ProductForm from './pages/products/ProductForm';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Route path={'/'} exact component={RedirectToUser} />
        <Route path={'/login'} component={Login} />
        <Route path={'/register'} component={Register} />
        <Route path={'/users'} exact component={Users} />
        <Route path={'/users/:id/links'} exact component={Links} />
        <Route path={'/products'} exact component={Products} />
        <Route path={'/products/create'} exact component={ProductForm} />
        <Route path={'/products/:id/edit'} exact component={ProductForm} />
        <Route path={'/orders'} exact component={Orders} />
        <Route path={'/profile'} exact component={Profile} />
      </BrowserRouter>
    </div>
  );
}

export default App;
