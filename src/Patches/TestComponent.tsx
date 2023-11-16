import { useEffect } from "react";

const TestComponent = () => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			console.log(`Key pressed: ${event.key}`);
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return <div>Press a key to see the console output</div>;
};

export default TestComponent;
