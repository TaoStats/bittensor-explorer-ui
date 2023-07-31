import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider as RollbarProvider } from "@rollbar/react";


import { theme } from "./theme";
import { rollbar } from "./rollbar";
import { router } from "./router";
import { ApiContextProvider } from "./contexts";

function App() {
	return (
		<ApiContextProvider>
			<RollbarProvider instance={rollbar}>
				<ThemeProvider theme={theme}>
					<RouterProvider router={router} />
				</ThemeProvider>
			</RollbarProvider>
		</ApiContextProvider>
	);
}

export default App;
