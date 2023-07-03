import { Routes, Route, BrowserRouter } from "react-router-dom";

import RadialBackground from "./components/RadialBackground";

import Docs from "./docs/Docs";
import Home from "./pages/Home";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<RadialBackground><Home /></RadialBackground>} />
				<Route path="/docs/*" element={<RadialBackground><Docs /></RadialBackground>} />
			</Routes>
		</BrowserRouter>
	);
};