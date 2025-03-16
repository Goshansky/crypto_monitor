import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "./CryptoList.module.css"; // Подключаем CSS-модуль

interface Crypto {
    id: string;
    name: string;
    current_price: number;
}

const fetchCryptos = async (page: number, orderBy: string): Promise<Crypto[]> => {
    const { data } = await axios.get<Crypto[]>("https://api.coingecko.com/api/v3/coins/markets", {
        params: { vs_currency: "usd", order: orderBy, per_page: 10, page },
    });
    return data;
};

const CryptoList = () => {
    const [page, setPage] = useState<number>(1);
    const [orderBy, setOrderBy] = useState<string>("market_cap_desc");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { data, error, isLoading } = useQuery<Crypto[], Error>({
        queryKey: ["cryptos", page, orderBy], // Обновленный формат
        queryFn: () => fetchCryptos(page, orderBy),
    });

    // Обработка случая, если data === undefined
    const cryptoData: Crypto[] = Array.isArray(data) ? data : [];

    // Фильтрация данных
    const filteredData = cryptoData.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Сортировка данных
    const sortedData = [...filteredData].sort((a, b) => {
        if (orderBy === "market_cap_desc" || orderBy === "price_desc") {
            return b.current_price - a.current_price;
        }
        if (orderBy === "market_cap_asc" || orderBy === "price_asc") {
            return a.current_price - b.current_price;
        }
        return a.name.localeCompare(b.name);
    });

    if (isLoading) return <p>Loading...</p>;
    if (error instanceof Error) return <p>Error loading data: {error.message}</p>;

    return (
        <div className={styles.container}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="🔍 Поиск криптовалюты..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select className={styles.select} onChange={(e) => setOrderBy(e.target.value)} value={orderBy}>
                <option value="market_cap_desc">По капитализации</option>
                <option value="market_cap_asc">По капитализации (возр.)</option>
                <option value="price_desc">Цена: по убыванию</option>
                <option value="price_asc">Цена: по возрастанию</option>
            </select>

            <ul className={styles.cryptoList}>
                {sortedData.map((crypto) => (
                    <li key={crypto.id} className={styles.cryptoItem}>
                        {crypto.name} - ${crypto.current_price}
                    </li>
                ))}
            </ul>

            <div className={styles.pagination}>
                <button className={styles.button} onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    ⬅ Назад
                </button>
                <span> Страница: {page} </span>
                <button className={styles.button} onClick={() => setPage((prev) => prev + 1)}>
                    Вперед ➡
                </button>
            </div>
        </div>
    );
};

export default CryptoList;






