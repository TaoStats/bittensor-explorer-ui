import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider as RollbarProvider } from "@rollbar/react";

import { theme } from "./theme";
import { rollbar } from "./rollbar";
import { router } from "./router";
import { ApiContextProvider, StatsContextProvider } from "./contexts";

function App() {
	return (
		<RollbarProvider instance={rollbar}>
			<ThemeProvider theme={theme}>
				<ApiContextProvider>
					<StatsContextProvider>
						<RouterProvider router={router} />
					</StatsContextProvider>
				</ApiContextProvider>
			</ThemeProvider>
		</RollbarProvider>
	);
}

export default App;
