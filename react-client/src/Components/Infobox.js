import infoIcon from "../assets/icon-info.svg";

const Infobox = ({ statusCode, message }) => {
    let additionalClasses = "";

    // Change background depending of statusCode
    const category = Math.floor(statusCode / 100); // e.g.: 200 -> 2, 403 -> 3, ...
    if (category == 2) additionalClasses = "bg-green-200";
    else if (category == 4 || category == 5) additionalClasses = "bg-orange-200";
    else additionalClasses = "bg-slate-200";

    // Hide if message is empty
    if (message == "") additionalClasses += " hidden"

    // Display line breaks in the message string
    const style = {
        whiteSpace: 'pre-line',
    }

    return (
        <div className={`${additionalClasses} text-black p-2
                    border-2 border-black border-dashed
                    flex flex-row items-center justify-center gap-2`}>
            <div className="h-auto w-10 flex-shrink-0">
                <img src={infoIcon} />
            </div>
            <div className="w-auto flex-grow text-center text-wrap" style={style}>{message}</div>
        </div>
    );
}

export default Infobox;