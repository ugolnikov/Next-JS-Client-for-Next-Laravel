const loadProduct = ({ sellerId, searchQuery, page = 1 } = {}) => {
    const url = `/api/products?${sellerId ? `seller_id=${sellerId}&` : ''}${
        searchQuery ? `search=${searchQuery}&` : ''
    }page=${page}`

    const {
        data: product,
        error,
    } = useSWR(url, () =>
        axios
            .get(url)
            .then(res => res.data)
            .catch(err => {
                throw err
            }),
    )
    return {
        product,
        isLoading: !product && !error,
        isError: error,
    }
}
const OneProduct = () => {

}