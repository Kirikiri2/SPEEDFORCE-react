import { createBrowserRouter } from "react-router";

import MainLayout from "./components/MainLayout.jsx";

import HomePage from "./pages/HomePage.jsx";
import ProductItem from "./components/ProductItem.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";


export const router = createBrowserRouter([
    {
        Component: MainLayout,
        children: [
            { index: true, Component: HomePage },
            {path: '/products',  Component: ProductListPage},
            {path: '/products/:id', Component: ProductItem},
            {path: '/sales', Component: SalesPage},
            {path: '/login', Component: LoginPage},
            {path: '/register', Component: RegisterPage},
            {path: '/cart', Component: CartPage},
        ]
    }
]);
