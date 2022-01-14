import React, {useState} from "react";

const StarPriority = (props) => {
    const [priority, setPriority] = useState(0);
    const [hover, setHover] = useState(0);
    const [priorityBool, setPriorityBool] = useState(false);


    if (props.isCurrentlyEditable) {
        
        return (
            <div className="starPriority"> {
                [...Array(5)].map((star, index) => {
                    index +=1;
                    return (
                            <button 
                                type="button"
                                key={index}
                                className={index <= (hover || priority) ? "on" : "off"}
                                onClick={() => {
                                    setPriority(index);
                                    props.onAdd(index);
                                    }}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(priority)}
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        )
                })
            }</div>
        );
    } else {
        if (!props.fedPriority && !priorityBool) {
            setPriority(1);
            setPriorityBool(true);
        } else if (!priority) {
            setPriority(props.fedPriority);
        }

        return (
            <div className="starPriority"> {
                [...Array(5)].map((star, index) => {
                    index +=1;
                    return (
                            <button 
                                type="button"
                                key={index}
                                className={index <= priority ? "on" : "off"}
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        )
                })
            }</div>
        );
    }
    
};

export default StarPriority;