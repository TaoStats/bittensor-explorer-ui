import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider as RollbarProvider } from "@rollbar/react";

import { theme } from "./theme";
import { rollbar } from "./rollbar";
import { router } from "./router";
import { StatsContextProvider } from "./contexts";

function App() {
	return (
		<RollbarProvider instance={rollbar}>
			<ThemeProvider theme={theme}>
				<StatsContextProvider>
					<RouterProvider router={router} />
				</StatsContextProvider>
			</ThemeProvider>
		</RollbarProvider>
	);
}

export default App;
