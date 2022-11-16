import React, { useEffect } from "react";
import { useRequest } from "ahooks";
import { Outlet } from "react-router-dom";
import SideBar from "@components/SideBar";
import "./index.less";
import { getCurrentUsersProfile } from "@service/users";
function MainLayout() {
	const { data, run } = useRequest(getCurrentUsersProfile, {
		manual: true,
		onSuccess: (res) => {
			console.log(res);
		},
	});
	useEffect(() => {
		run();
	}, []);
	return (
		<div className="main">
			<SideBar />
			<Outlet />
		</div>
	);
}
export default MainLayout;
