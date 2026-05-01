import ProductsList from "../components/ProductsList";

export default function ProductListPage() {
    return (
        <div className="container mx-auto flex flex-col items-center gap-6 my-10">
            <ProductsList visible={'all'} />
        </div>
    );
}
