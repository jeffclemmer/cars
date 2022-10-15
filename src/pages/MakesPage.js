import { useState, useRef, useEffect } from "react";

import { onlyLowercase } from "../helpers/Filter";

import Dialog from "../components/Dialog";
import Overlay from "../components/Overlay";
import Toolbar from "../components/Toolbar";
import Loading from "../components/Loading";
import List from "../components/List";
import ListItem from "../components/ListItem";

// contains the entire page for Makes
function MakesPage(props) {
  const makeInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [makes, updateMakes] = useState([]);

  // an array of ids that points into "makes".  if an id
  // exists in this array, that means it's selected = true
  const [selected, updateSelected] = useState([]);

  // load list of makes
  useEffect(() => {
    function load() {
      loadData();
    }
    load();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await fetch(`//localhost:3000/makes`, {});

      if (res.status === 200) {
        const data = await res.json();
        updateMakes(data);
      } else {
        console.log("there was a server error");
      }
    } catch (error) {
      console.log("fetch error", error);
    } finally {
      setIsLoading(false);
    }
  }

  function addItem() {
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }

  async function addDialogButtonHandler(text) {
    if (text === "Cancel") closeAddDialog();
    if (text === "Save") {
      const name = makeInputRef.current.value;
      // const make = name.toLowerCase().replace(" ", "");
      const make = onlyLowercase(name);

      // normally we would do some deeper form validation here...
      if (make !== "") {
        closeAddDialog();

        setIsLoading(true);

        await fetch("//localhost:3000/add-make", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            make: make,
            dname: name,
          }),
        });

        loadData();
      }
    }
  }

  function itemCheckboxClickHandler(id, checked) {
    let index = selected.findIndex((item) => item === id);
    if (index === -1) {
      selected.push(id);
    } else {
      selected.splice(index, 1);
    }
    updateSelected(selected);
  }

  function deleteItem() {
    if (selected.length > 0) setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  async function deleteDialogButtonHandler(text) {
    closeDeleteDialog();
    if (text === "Yes") {
      // execute delete
      let ids = selected.join(",");

      setIsLoading(true);
      // the server returns "+" after completing
      await fetch(`//localhost:3000/delete-make?makes=${ids}`, {});
      setIsLoading(false);

      loadData();
    }
  }

  return (
    <div>
      <Toolbar title="Car Makes" addClick={addItem} deleteClick={deleteItem} />

      <List cols={["Name"]}>
        {makes.map((item, index) => {
          return (
            <ListItem
              key={index}
              id={item.make}
              fields={item}
              display={["dname"]}
              link={`/models/${item.make}`}
              editIcon={false}
              checkboxClick={itemCheckboxClickHandler}
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
            <label htmlFor="make">
              Name of Make <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              id="make"
              ref={makeInputRef}
              autoComplete="off"
            />
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

      {isLoading && <Overlay />}
      {isLoading && <Loading />}
    </div>
  );
}

export default MakesPage;
