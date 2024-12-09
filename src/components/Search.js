import Button from '@/components/Button'
const Search = ({ searchQuery, setSearchQuery, handleSearch }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="my-8 flex justify-center max-w-2xl mx-auto">
            <div className="relative flex w-full">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Поиск товаров..."
                    className="w-full px-4 py-3 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4438ca] focus:border-transparent"
                />
                <Button
                    onClick={handleSearch}
                    className="px-6 py-3 text-xs bg-[#4438ca] text-white rounded-r hover:bg-[#362ea1] transition-colors duration-200 flex items-center">
                    <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                    <span className="ml-2">Поиск</span>
                </Button>
            </div>
        </div>
    )
}

export default Search
