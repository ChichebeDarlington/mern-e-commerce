import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./components/HomePage";
import Product from "./components/Product";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { useContext, useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from "./Store";
import { CartScreen } from "./components/CartScreen";
import SigninScreen from "./components/SigninScreen";
import NavDropDown from "react-bootstrap/NavDropDown";
import ShippingScreen from "./components/ShippingScreen";
import SignupScreen from "./components/SignupScreen";
import PaymentMethodScreen from "./components/PaymentMethodScreen";
import PlaceOrderScreen from "./components/PlaceOrderScreen";
import OrderScreen from "./components/OrderScreen";
import OrderHistoryScreen from "./components/OrderHistoryScreen";
import ProfileScreen from "./components/ProfileScreen";
import Button from "react-bootstrap/Button";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./SearchBox";
import SearchScreen from "./components/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardScreen from "./components/DashboardScreen";

const App = () => {
  const { state, dispatch: ctxdispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxdispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          isSidebarOpen
            ? "d-flex flex-column site-container active-container"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <Helmet>
          <title>Amamerce</title>
        </Helmet>
        <Nav className="me-auto">
          <Link to="/cart" className="nav-link">
            Cart
            {cart.cartItem.length > 0 && (
              <Badge pill bg="danger">
                {cart.cartItem.reduce((acc, curr) => acc + curr.quantity, 0)}
              </Badge>
            )}
          </Link>
          {userInfo ? (
            <NavDropDown title={userInfo.name} id="basic-nav-dropdown">
              <LinkContainer to="/profile">
                <NavDropDown.Item>User Profile</NavDropDown.Item>
              </LinkContainer>
              <LinkContainer to="/orderhistory">
                <NavDropDown.Item>Order History</NavDropDown.Item>
              </LinkContainer>
              <Link
                className="dropdown-item"
                to="#signout"
                onClick={signoutHandler}
              >
                Sign Out
              </Link>
            </NavDropDown>
          ) : (
            <Link className="nav-link" to="/signin">
              Sign In
            </Link>
          )}
          {userInfo && userInfo.isAdmin && (
            <NavDropDown title="admin" id="admin-nav-dropdown">
              <LinkContainer to="/admin/dashboard">
                <NavDropDown.Item>Dashboard</NavDropDown.Item>
              </LinkContainer>
              <LinkContainer to="/productlist">
                <NavDropDown.Item>Products</NavDropDown.Item>
              </LinkContainer>
              <LinkContainer to="/orderlist">
                <NavDropDown.Item>Orders</NavDropDown.Item>
              </LinkContainer>
              <LinkContainer to="/userlist">
                <NavDropDown.Item>Users</NavDropDown.Item>
              </LinkContainer>
            </NavDropDown>
          )}
        </Nav>
        <header className="">
          <Navbar bg="dark" variant="dark">
            <Container>
              <Button
                variant="dark"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <i className="fas far-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Amamerce</Navbar.Brand>
              </LinkContainer>
            </Container>
          </Navbar>
          <SearchBox />
        </header>
        <div
          className={
            isSidebarOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              {/* admin route */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/search" element={<SearchScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All right reserved!</div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
