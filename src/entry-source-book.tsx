import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SourceBook from "./pages/compendium/SourceBook";
import "./index.css";
import "./styles/ascendant-ui.css";
import "./styles/sa-theme.css";
import "./styles/source-book.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	const root = createRoot(rootElement);
	root.render(
		<BrowserRouter>
			<Routes>
				<Route path="/source-book/*" element={<SourceBook />} />
				<Route
					path="*"
					element={<Navigate to="/source-book/intro" replace />}
				/>
			</Routes>
		</BrowserRouter>,
	);
}
