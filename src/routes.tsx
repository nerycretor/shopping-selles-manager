import { createBrowserRouter, redirect } from "react-router-dom";
import Homepage from "./pages/home-page";
import TransactionsPage from "./pages/transactions-page";
import StockPage from "./pages/stock-page";
import ProvidersPage from "./pages/providers-page";
import EmployeePage from "./pages/employees-page";
import { AuthPage } from "./pages/auth-page";
import { account } from "./appwrite/appwrite";
import AttendentPage from "./pages/attendent-page";
import BillsPage from "./pages/bills-page";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <AuthPage />
    },
    {
        path: "/",
        element: <Homepage />,
        loader: async () => {
            try {
                const user = await account.get()
                return { user }
            } catch (error) {
                throw redirect("/login")
            }
        }
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
    },
    {
        path: "/employees",
        element: <EmployeePage />
    },
    {
        path: "/attendent",
        element: <AttendentPage />
    },
    {
        path: "/bills",
        element: <BillsPage />
    }
])