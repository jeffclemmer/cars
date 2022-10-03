import { useState, useRef } from "react";

import Dialog from "../components/Dialog";
import Overlay from "../components/Overlay";
import Toolbar from "../components/Toolbar";
import List from "../components/List";
import ListItem from "../components/ListItem";

// contains the entire page for Makes
function MakesPage(props) {
  const makeInputRef = useRef();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [makes, updateMakes] = useState([
    { id: makeId(), link: "Ford", name: "Ford", selected: false },
    {
      id: makeId(),
      link: "GeneralMotors",
      name: "General Motors",
      selected: false,
    },
    { id: makeId(), link: "Honda", name: "Honda", selected: false },
  ]);

  function addItem() {
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }

  function addDialogButtonHandler(text) {
    if (text === "Save") {
      const make = makeInputRef.current.value;

      // normally we would do some deeper form validation here...
      if (make !== "") {
        makes.push({
          id: makeId(),
          link: make.replace(" ", ""),
          name: make,
          selected: false,
        });

        // sort makes by name
        makes.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        console.log("makes:", makes);
        updateMakes(makes);
      }
    }

    closeAddDialog();
  }

  function deleteItem() {
    setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  function deleteDialogButtonHandler(text) {
    closeDeleteDialog();
  }

  return (
    <div>
      <Toolbar title="Car Makes" addClick={addItem} deleteClick={deleteItem} />

      <List cols={["Name"]}>
        {makes.map((item, index) => {
          return (
            <ListItem
              key={index}
              id={item.id}
              fields={item}
              display={["name"]}
              link={`/models/${item.link}`}
              editIcon={false}
            ></ListItem>
          );
        })}
      </List>

      {isAddDialogOpen && <Overlay close={closeAddDialog} />}
      {isAddDialogOpen && (
        <Dialog
          title="Add New Make"
          buttonHandler={addDialogButtonHandler}
          buttons={["Cancel", "Save"]}
        >
          <div>
            <label htmlFor="make">Name of Make</label>
            <input type="text" required id="make" ref={makeInputRef} />
          </div>
        </Dialog>
      )}

      {isDeleteDialogOpen && <Overlay close={closeDeleteDialog} />}
      {isDeleteDialogOpen && (
        <Dialog
          title="Are You Sure?"
          buttons={["No", "Yes"]}
          buttonHandler={deleteDialogButtonHandler}
        >
          Are you sure you want to delete these items?
        </Dialog>
      )}
    </div>
  );
}

function makeId() {
  return Math.ceil(Math.random() * 10000);
}

export default MakesPage;
