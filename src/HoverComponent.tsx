import React, { useState } from "react";

interface HoverAreasProps {
	noteArrays: Array<Array<string>>;
	onHover: (value: Array<string>) => void;
}

const HoverAreasComponent: React.FC<HoverAreasProps> = ({
	noteArrays,
	onHover,
}) => {
	// State to store the current value when hovering over an area
	// const [hoveredValue, setHoveredValue] = useState<number | null>(null);

	// Function to handle onMouseEnter event
	const handleMouseEnter = (value: Array<string>) => {
		// setHoveredValue(value);
		onHover(value); // Call the callback function to pass the value to the main component
	};

	// Function to handle onMouseLeave event (optional)
	const handleMouseLeave = () => {
		// setHoveredValue(null);
	};

	return (
		<div>
			{noteArrays?.map((noteArray, index) => (
				<div className={`hover-component`} key={index}>
					<div
						onMouseEnter={() => handleMouseEnter(noteArray)}
						onMouseLeave={handleMouseLeave}
						style={{
							border: "1px solid black",
							padding: "10px",
							margin: "10px",
						}}
					>
						Hover over me!
					</div>
				</div>
			))}
		</div>
	);
};

export default HoverAreasComponent;
