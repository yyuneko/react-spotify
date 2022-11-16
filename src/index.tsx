import React, { Suspense } from "react";
import ReactDom from "react-dom/client";
import {
	BrowserRouter,
	Outlet,
	Route,
	Routes,
	useParams,
} from "react-router-dom";

import MainLayout from "@layouts/MainLayout";
import Login from "@layouts/Login";
import Home from "@containers/Home";
import routes from "./router";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/" element={<MainLayout />}>
					<Route element={<Home />} />
					{routes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={
								<Suspense>
									<route.component />
								</Suspense>
							}
						/>
					))}
				</Route>
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}
ReactDom.createRoot(document.getElementById("root")).render(<App />);
