/* 
props accepted

title = string
content = string
buttons = array of objects
  ["No", "Yes"]
buttonHandler = function that takes a "text" parameter
  {buttonHandler(text)}
  returns the text of the button clicked
width = a number, defaults to 330
*/

import classes from "./Dialog.module.css";

function Dialog(props) {
  // default dialog size
  let width = "330px";
  let marginLeft = "-165px";

  // if width is included in props, recalculate center
  if ("width" in props) {
    width = props.width.toString() + "px";
    marginLeft = (-props.width / 2).toString() + "px";
  }

  return (
    <div
      className={classes.dialog}
      style={{ width: width, marginLeft: marginLeft }}
    >
      <div>
        <div className={classes.title}>{props.title}</div>
        <hr className={classes.divider} />
      </div>

      {/* text goes here */}
      <div className={classes.slot}>{props.children}</div>

      <div className={classes.buttons}>
        <hr className={classes.divider} />

        <div>
          <button
            className={classes.btn}
            onClick={() => {
              props.buttonHandler(props.buttons[0]);
            }}
          >
            {props.buttons[0]}
          </button>
          <button
            className={classes.btn}
            onClick={() => {
              props.buttonHandler(props.buttons[1]);
            }}
          >
            {props.buttons[1]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
