import React from "react";

const Listbox = props => {

    const clicked = e => {
        e.preventDefault();
        props.clicked(e.target.id)
    }

    return(
<div>
    {props.items.map((item, idx) => 
    <button key={idx} 
    onClick={clicked}
            id={item.track.id}>

            {item.track.name}
    </button>)
    }
</div>
    );
}

export default Listbox;