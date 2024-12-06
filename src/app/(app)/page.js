import ProductList from '@/components/Products'
import Navigation from '@/components/Navigation'

const Home = () => {
    return (
        <div  className="min-h-screen bg-white">
            <div className="relative flex items-top min-h-screen sm:items-top sm:pt-0 w-full">
                <div className="pt-8 sm:pt-0 text-black bg-white p-5 rounded w-full">
                    <ProductList/>
                </div>
            </div>
        </div>
    )
}

export default Home
