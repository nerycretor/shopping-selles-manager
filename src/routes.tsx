import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/home-page";
import TransactionsPage from "./pages/transactions-page";
import StockPage from "./pages/stock-page";
import ProvidersPage from "./pages/providers-page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />
    },
    {
        path: "/transactions",
        element: <TransactionsPage />
    },
    {
        path: "/stock",
        element: <StockPage />
    },
    {
        path: "/providers",
        element: <ProvidersPage />
    }
])