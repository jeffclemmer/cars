/* 
props accepted
{children}
onClick = a function passed in that accepts a boolean if the checkbox is true or false
  ie: onClick={clickHandler}
  function clickHandler(checked) {}
disabled = boolean
value = boolean - whether default selected is true or false
*/

import { useState, useEffect } from "react";

function Checkbox(props) {
  const [value, setValue] = useState(false);

  // set default value
  useEffect(() => {
    // default value
    if (props.value === true) {
      setValue(true);
    }
  }, [props]);

  function click() {
    if ("disabled" in props === false || props.disabled === false) {
      setValue(!value);
      if ("onClick" in props && typeof props.onClick == "function") {
        props.onClick(!value);
      }
    }
  }

  return (
    <div>
      {value === false && (
        <div onClick={click}>
          <svg width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 21V3h18v18Zm2-2h14V5H5Z"></path>
          </svg>
        </div>
      )}
      {value === true && (
        <div onClick={click}>
          <svg width="1em" height="1em" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m10.6 16.2l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4ZM3 21V3h18v18Z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}

export default Checkbox;
