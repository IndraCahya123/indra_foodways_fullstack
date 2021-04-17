import { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

import { StatusBoxMapContextProvider } from './contexts/statusBoxMapContext';
import { ModalContextProvider } from './contexts/modalContext';
import { OrderContextProvider } from './contexts/orderContext';
import { CurrentLocationContextProvider } from './contexts/currentLocationContext';
import { GlobalRefetchProvider } from './contexts/globalRefetch';

import { UserContext } from './contexts/userContext';

import Navbar from './components/navbar';
import LoginPrivateRoute from './components/PrivateRoute/LoginPrivateRoute';
import { APIURL, setAuthToken } from './api/integration';

import LandingPage from './pages/Landing';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import RestaurantProductDetail from './pages/Customer/RestaurantProductDetail';
import AddProduct from './pages/Partner/AddProduct';
import PartnerLoggedLandingPage from './pages/Partner/PartnerLogged';
import Orders from './pages/Customer/OrderPage';

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {

  const queryClient = new QueryClient();

  const [stateUser, dispatch] = useContext(UserContext);

  const checkUser = async () => {
    try {
      const response = await APIURL.get("/is-auth");

      if (response.status === 401) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data;
      payload.user.token = localStorage.token;
      
      dispatch({
        type: "AUTH_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      <GlobalRefetchProvider>
        <QueryClientProvider client={queryClient}>
          <CurrentLocationContextProvider>
            <StatusBoxMapContextProvider>
              <ModalContextProvider>
                <OrderContextProvider>
                  <Router>
                    <Navbar />
                    <Switch>
                      {stateUser.loading ? <Route exact path="/" component={LandingPage} /> : <LoginPrivateRoute exact path="/" component={LandingPage} /> }
                      <LoginPrivateRoute exact path="/profile" component={Profile} />
                      <LoginPrivateRoute exact path="/edit-profile/:id" component={EditProfile} />
                      <LoginPrivateRoute exact path="/add-product" component={AddProduct} />
                      <LoginPrivateRoute exact path="/restaurant-product-detail/:id" component={RestaurantProductDetail} />
                      <LoginPrivateRoute exact path="/partner" component={PartnerLoggedLandingPage} />
                      <LoginPrivateRoute exact path="/orders" component={Orders} />
                    </Switch>
                  </Router>
                </OrderContextProvider>
              </ModalContextProvider>
              </StatusBoxMapContextProvider>
            </CurrentLocationContextProvider>
          </QueryClientProvider>
        </GlobalRefetchProvider>
    </>
  );
}

export default App;
