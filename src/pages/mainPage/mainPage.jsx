import { useAuth } from "../../auth/useAuth";

const MainPage = () => {
	const auth = useAuth();
	return (
		<div>
			<p>Главная страница</p>
		</div>
	)
}

export default MainPage;
