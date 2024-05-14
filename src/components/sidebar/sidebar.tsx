import { ChevronDown, CreditCard, LayoutGrid, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar(){
    return (
        <div className="bg-rose-900 h-full w-[250px] p-5 relative">
            <h1 className="text-3xl font-bold text-white">BCODER</h1>

            <div className="flex flex-col gap-2 mt-8">
                <Link to={"/"}>
                    <span className="text-white font-bold flex gap-3 items-center group">
                        <LayoutGrid className="size-4 text-white"/>
                        Pagina Inicial
                    </span>
                </Link>

                <Link to={"/transactions"}>
                    <span className="text-white font-bold flex gap-3 items-center group">
                        <CreditCard className="size-4 text-white"/>
                        Transacoes
                    </span>
                </Link>

                <Link to={"/stock"}>
                    <span className="text-white font-bold flex gap-3 items-center group">
                        <Store className="size-4 text-white"/>
                        Stock
                    </span>
                </Link>

                <Link to={"/providers"}>
                    <span className="text-white font-bold flex gap-3 items-center group">
                        <Truck className="size-4 text-white"/>
                        Fornecedores
                    </span>
                </Link>
            </div>

            <div className="flex flex-1 gap-2 items-center absolute bottom-0 mb-5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold">CT</div>
                <p className="text-white font-bold">Cornelio Teixeira</p>
                <ChevronDown className="text-white"/>
            </div>
        </div>
    )
}