import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./core/theme/index.css";
import "@fontsource-variable/onest";
import App from "./app/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeroUIProvider } from "@heroui/system";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<HeroUIProvider>
			<StrictMode>
				<App />
				<ReactQueryDevtools />
			</StrictMode>
		</HeroUIProvider>
	</QueryClientProvider>,
);
