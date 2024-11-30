import React from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import AppLayout from "./components/Layout/AppLayout";
import ISO20022Validator from "./components/Validators/ISO20022Validator";
import FedNowValidator from "./components/Validators/FedNowValidator";
import Home from "./components/Home";
import RuleLogic from "./components/RuleLogicValidator";

const App = () => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem("theme");
		return savedTheme
			? savedTheme === "dark"
			: window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");
	}, [isDarkMode]);

	return (
		<BrowserRouter>
			<ConfigProvider
				theme={{
					algorithm: isDarkMode
						? antTheme.darkAlgorithm
						: antTheme.defaultAlgorithm,
					token: {
						colorPrimary: "#1677ff",
						borderRadius: 6,
					},
				}}
			>
				<Routes>
					<Route
						path="/"
						element={
							<AppLayout
								isDarkMode={isDarkMode}
								onThemeChange={() => setIsDarkMode(!isDarkMode)}
							/>
						}
					>
						<Route index element={<Home />} />
						<Route path="iso20022" element={<ISO20022Validator />} />
						<Route path="fednow" element={<FedNowValidator />} />
						<Route path="rulelogic" element={<RuleLogic />} />
					</Route>
				</Routes>
			</ConfigProvider>
		</BrowserRouter>
	);
};

export default App;
