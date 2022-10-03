function gridLayout(display) {
  // this controls the sizing of a dynamically created table, taking into
  // account the checkbox on the left and the icon on the right, giving
  // them each 32px, while dividing up the rest of the fields to each
  // displayed column
  let width = 100 / display.length;
  let buttonCalc = 64 / display.length;
  return (
    "32px " +
    display
      .map(() => {
        return `calc(${width}% - ${buttonCalc}px)`;
      })
      .join(" ") +
    " 32px"
  );
}

export default gridLayout;
