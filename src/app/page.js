'use client'
import ProductList, {refreshProducts} from '@/components/Products'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/auth'

const Home = () => {
    const { user } = useAuth({ middleware: 'guest' })
    return (
        <>
        <div  className="min-h-screen bg-white">
        <Navigation user={user}/>
            <div className="relative flex items-top min-h-screen sm:items-top sm:pt-0 w-full">
                <div className="pt-8 sm:pt-0 text-black bg-white p-5 rounded w-full">
                    <ProductList/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home
