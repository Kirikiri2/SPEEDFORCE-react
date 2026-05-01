import SalesChart from "../components/SalesChart";

export default function SalesPage(){
    return(
        <div className="container mx-auto my-10">
            <h2 className="text-3xl font-semibold text-center mb-8 text-white tracking-wide">Статистика</h2>
            <SalesChart />
        </div>
    )
}