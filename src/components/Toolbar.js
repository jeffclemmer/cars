function Toolbar(props) {
  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-add">
          <button onClick={props.addClick}>
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4Zm-6 4q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Z"
              ></path>
            </svg>
          </button>
        </div>
        <div className="toolbar-title">{props.title}</div>
        <div className="toolbar-delete">
          <button onClick={props.deleteClick}>
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1ZM7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
