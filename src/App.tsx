import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store.tsx";
import CryptoList from "./components/CryptoList";
import Chat from "./components/Chat";
import styles from "./App.module.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 минут
            refetchOnWindowFocus: false, // Не перезапрашивать при фокусе
        },
    },
});

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <div className={styles.container}>
                    <h1>Crypto Monitor</h1>
                    <div className={styles.cryptoSection}>
                        <CryptoList/>
                    </div>
                    <div className={styles.chatSection}>
                        <Chat/>
                    </div>
                </div>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
