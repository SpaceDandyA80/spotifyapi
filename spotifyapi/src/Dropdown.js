import React from "react";

const Dropdown = props => {
// change event handler in the dropdown component
const dropdownChanged = e => {
    props.changed(e.target.value);
}
    return(
<div>
    {/* the value of the playlist genre */}
    <select value={props.selectedValue} onChange={dropdownChanged}>
        {props.options.map((item, idx) =>  <option key={idx} value={item.id}> {item.name}</option>)}
    </select>

</div>
    );
}

export default Dropdown