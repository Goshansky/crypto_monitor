import axios from "axios";

export interface Crypto {
    id: string;
    name: string;
    current_price: number;
}

export const fetchCryptos = async ({
                                       page = 1,
                                       perPage = 10,
                                       orderBy = "market_cap_desc",
                                       search = "",
                                   }: {
    page?: number;
    perPage?: number;
    orderBy?: string;
    search?: string;
}): Promise<Crypto[]> => {
    const { data } = await axios.get<Crypto[]>("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
            vs_currency: "usd",
            order: orderBy,
            per_page: perPage,
            page,
            category: search.toLowerCase(), // Используем поле category для фильтрации
        },
    });
    return data;
};
