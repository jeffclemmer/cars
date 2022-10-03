import gridLayout from "../helpers/GridLayout";

function List(props) {
  let gridTemplateColumns = gridLayout(props.cols);

  return (
    <div>
      <div
        className="list-header"
        style={{ gridTemplateColumns: gridTemplateColumns }}
      >
        <div className="list-item-col">
          <input type="checkbox"></input>
        </div>

        {/* we use style here to custom size each column */}
        {props.cols.map((item, index) => {
          return (
            <div
              key={index}
              className="list-header-cols"
              style={{ gridColumn: index + 2 }}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div>{props.children}</div>
      <div className="list-footer">
        <div className="list-prev">
          <button title="not implemented">
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6Z"
              ></path>
            </svg>
          </button>
        </div>
        <div className="list-next">
          <button title="not implemented">
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M9.4 18L8 16.6l4.6-4.6L8 7.4L9.4 6l6 6Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default List;
