import { ColorPicker, useColor } from "react-color-palette";

export default function ColorPicker(props) {
    let lastColor;
    
    if (props.color) {
        lastColor = props.color;
    } else {
        lastColor = "#121212";
    }

    const [color, setColor] = 
        useColor("hex", lastColor) || useColor(";
 
    return (
        <div>
            <h1>Color Picker - GeeksforGeeks</h1>
            <ColorPicker width={456} height={228}
                color={color}
                onChange={setColor} hideHSV dark />;
        </div>
    )
};