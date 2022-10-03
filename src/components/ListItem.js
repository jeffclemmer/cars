/* 
props.fields is an object that contains the fields we want to display.  this object can 
contain anything.  coupled with an array, props.display contains the field names
that we want to display from props.fields.

the order of the display array lays out the table from left to right, starting with 
array position 0.

fields = { col1: "[value of col1]", col2: "[value of col2]", col3: "some value" }
display = [ "col1", "col2" ]

the above would create a two column list item, showing only col1 and col2 in that order.

*/

import { useNavigate } from "react-router-dom";

import gridLayout from "../helpers/GridLayout";

function ListItem(props) {
  const navigate = useNavigate();

  // this controls the sizing of a dynamically created table, taking into
  // account the checkbox on the left and the icon on the right, giving
  // them each 32px, while dividing up the rest of the fields to each
  // displayed column
  // let width = 100 / props.display.length;
  // let buttonCalc = 64 / props.display.length;
  // let gridTemplateColumns =
  //   "32px " +
  //   props.display
  //     .map(() => {
  //       return `calc(${width}% - ${buttonCalc}px)`;
  //     })
  //     .join(" ") +
  //   " 32px";

  let gridTemplateColumns = gridLayout(props.display);

  // console.log("gridTemplateColumns:", gridTemplateColumns);
  // might look like:
  // gridTemplateColumns: 32px calc(25% - 16px) calc(25% - 16px) calc(25% - 16px) calc(25% - 16px) 32px

  function clickHelper() {
    // is the list onClick responding to a link or an edit?
    if ("link" in props && props.link !== "") {
      navigate(props.link, { replace: false });
    } else if ("edit" in props && typeof props.edit == "function") {
      props.edit(props.id);
    }
  }

  return (
    <div
      className="list-item"
      style={{ gridTemplateColumns: gridTemplateColumns }}
    >
      <div className="list-item-col">
        <input type="checkbox"></input>
      </div>

      {/* we use style here to custom size each column */}
      {props.display.map((item, index) => {
        return (
          <div
            key={index}
            style={{ gridColumn: index + 2 }}
            onClick={() => clickHelper(props.id)}
          >
            {props.fields[item]}
          </div>
        );
      })}

      <div
        style={{ gridColumn: props.display.length + 2, textAlign: "center" }}
        onClick={() => clickHelper(props.id)}
      >
        {props.editIcon && (
          <svg width="1em" height="1em" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M5 23.7q-.825 0-1.413-.588Q3 22.525 3 21.7v-14q0-.825.587-1.413Q4.175 5.7 5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.587 1.412q-.588.588-1.413.588Zm7-9Zm4.175-8.425l1.425 1.4l-6.6 6.6V15.7h1.4l6.625-6.625l1.425 1.4l-7.2 7.225H9v-4.25Zm4.275 4.2l-4.275-4.2l2.5-2.5q.6-.6 1.438-.6q.837 0 1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8Z"
            ></path>
          </svg>
        )}
      </div>
    </div>
  );
}

export default ListItem;
