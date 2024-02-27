import React from "react";

interface RythmsOverrideProps {
	isActive: boolean;
	value: string[]; // Assuming the value to be a comma-separated string for simplicity
	label: string;
	setActive: (isActive: boolean) => void; // Directly pass the setter for the isActive state
	setValue: (value: string[]) => void; // Directly pass the setter for the value, with conversion logic handled inside
}

const RythmsOverride: React.FC<RythmsOverrideProps> = ({
	isActive,
	value,
	label,
	setActive,
	setValue,
}) => {
	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Split the input string by commas to create an array
		const valueArray = e.target.value.split(",").map((item) => item.trim()); // trim() to remove any leading/trailing spaces

		console.log("Final valueArray:", valueArray); // Log the final array
		setValue(valueArray);
	};

	// Ensure that the value prop is correctly converted to a string for rendering
	const inputValue = value.join(", ");

	return (
		<div className="override-control">
			<label style={{ marginRight: "10px" }}>{label}:</label>
			<input
				type="checkbox"
				checked={isActive}
				onChange={(e) => setActive(e.target.checked)}
				style={{ marginRight: "10px" }}
			/>
			<input
				type="text"
				value={inputValue} // Join the array to a string for display
				onChange={handleValueChange}
				disabled={!isActive}
				style={{ opacity: isActive ? 1 : 0.5 }}
			/>
		</div>
	);
};

export default RythmsOverride;
