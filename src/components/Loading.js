function Loading(props) {
  return (
    <div className="spin-container">
      <div>
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          className="spinner spin"
        >
          <g fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14Zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z"
              clipRule="evenodd"
              opacity=".2"
            ></path>
            <path d="M12 22c5.523 0 10-4.477 10-10h-3a7 7 0 0 1-7 7v3ZM2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2Z"></path>
          </g>
        </svg>
      </div>
      <div>Working</div>
    </div>
  );
}

export default Loading;
