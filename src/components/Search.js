const Search = ({ searchQuery, setSearchQuery, handleSearch }) => {
    return (
        <div className="my-5 flex justify-center">
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#4438ca] text-white rounded me-3">
                Поиск
            </button>

            {/* Поле поиска */}
            <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="border px-4 py-2 rounded w-[70%]"
            />
        </div>
    )
}
export default Search
