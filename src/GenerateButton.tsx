// GenerateButton.tsx

import React from "react";

interface ButtonProps {
	onClick: () => void; // Define the function to be called when the button is clicked
	text: string; // The text to display on the button
}

const GenerateButton: React.FC<ButtonProps> = ({ onClick, text }) => {
	return <button onClick={onClick}>{text}</button>;
};

export default GenerateButton;
