import { useState, useEffect } from "react";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const CryptoMarket = () => {
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(null);

    // Fetching data using async/await
    const fetchDataAsync = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setCoins(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetching data using .then
    // const fetchDataThen = () => {
    //     fetch(API_URL)
    //         .then(response => response.json())
    //         .then(data => setCoins(data))
    //         .catch(error => console.error("Error fetching data:", error));
    // };

    useEffect(() => {
        fetchDataAsync(); // Choose either fetchDataAsync or fetchDataThen
    }, []);

    // Search functionality
    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    // Sorting functionality
    const sortedCoins = [...filteredCoins].sort((a, b) => {
        if (sortBy === "market_cap") {
            return b.market_cap - a.market_cap;
        } else if (sortBy === "percentage_change") {
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
        }
        return 0;
    });

    return (
        <div className="crypto-container">
            <h1>Crypto Market Dashboard</h1>
            <input
                type="text"
                placeholder="Search by Name or Symbol"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => setSortBy("market_cap")}>Sort By Market Cap</button>
            <button onClick={() => setSortBy("percentage_change")}>Sort By Percentage Change</button>
            <table>
                <thead>
                    <tr>
                        <th>Logo</th>
                        <th>Name</th>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>24h % Change</th>
                        <th>Market Cap</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCoins.map(coin => (
                        <tr key={coin.id}>
                            <td><img src={coin.image} alt={coin.name} width="30" /></td>
                            <td>{coin.name}</td>
                            <td>{coin.symbol.toUpperCase()}</td>
                            <td>${coin.current_price.toFixed(2)}</td>
                            <td style={{ color: coin.price_change_percentage_24h >= 0 ? "green" : "red" }}>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                            </td>
                            <td>${coin.market_cap.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CryptoMarket;
