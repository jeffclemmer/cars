import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Dialog from "../components/Dialog";
import Overlay from "../components/Overlay";
import Toolbar from "../components/Toolbar";
import Loading from "../components/Loading";
import List from "../components/List";
import ListItem from "../components/ListItem";

// contains the entire page for Models
function ModelsPage(props) {
  const modelInputRef = useRef();
  const yearInputRef = useRef();
  const typeInputRef = useRef();
  const engineInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [models, updateModels] = useState([]);
  const [name, updateName] = useState([]);

  // an array of ids that points into "makes".  if an id
  // exists in this array, that means it's selected = true
  const [selected, updateSelected] = useState([]);

  // get the make passed in as part of the url
  let { make } = useParams();

  // load a make and its models
  useEffect(() => {
    function load() {
      loadData(make);
    }
    load();
  }, [make]);

  async function loadData(make) {
    setIsLoading(true);
    try {
      const res = await fetch(`//localhost:3000/models/${make}`, {});

      if (res.status === 200) {
        const data = await res.json();
        updateName(data.dname);
        updateModels(data.models);
      } else {
        console.log("there was a server error");
      }
    } catch (error) {
      console.log("fetch error:", error);
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
    closeAddDialog();

    const model = modelInputRef.current.value;
    const year = yearInputRef.current.value;
    const type = typeInputRef.current.value;
    const engine = engineInputRef.current.value;

    if (text === "Save") {
      // normally we would do some deeper form validation here...
      if (model && year && type && engine) {
        setIsLoading(true);
        const res = await fetch("//localhost:3000/add-model", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            make: make,
            model: model,
            year: year,
            type: type,
            engine: engine,
          }),
        });

        loadData(make);
      }
    }

    if (text === "Update") {
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

  function editItem(id) {
    console.log("listItem editClick id:", id);
  }

  function deleteItem() {
    if (selected.length > 0) setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  async function buttonHandler(text) {
    closeDeleteDialog();
    if (text === "Yes") {
      // execute delete
      let ids = selected.join(",");

      setIsLoading(true);

      // the server returns "+" after completing
      await fetch(`//localhost:3000/delete-model/${make}?models=${ids}`, {});

      loadData(make);
    }
  }

  return (
    <div>
      <Toolbar
        title={`Car Models - ${name}`}
        addClick={addItem}
        deleteClick={deleteItem}
      />
      <List cols={["Model", "Type", "Year", "Engine"]}>
        {models.map((item, index) => {
          return (
            <ListItem
              key={index}
              id={item.id}
              fields={item}
              display={["name", "type", "year", "engine"]}
              edit={editItem}
              editIcon={true}
              checkboxClick={itemCheckboxClickHandler}
            ></ListItem>
          );
        })}
      </List>

      {isAddDialogOpen && <Overlay close={closeAddDialog} />}
      {isAddDialogOpen && (
        <Dialog
          title="Add New Model"
          buttonHandler={addDialogButtonHandler}
          buttons={["Cancel", "Save"]}
        >
          <div>
            <label htmlFor="make">Model</label>
            <input
              type="text"
              required
              id="model"
              ref={modelInputRef}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="make">Year</label>
            <input
              type="text"
              required
              id="year"
              ref={yearInputRef}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="make">Type</label>
            <input
              type="text"
              required
              id="type"
              ref={typeInputRef}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="make">Engine</label>
            <input
              type="text"
              required
              id="engine"
              ref={engineInputRef}
              autoComplete="off"
            />
          </div>
        </Dialog>
      )}

      {isDeleteDialogOpen && <Overlay close={closeDeleteDialog} />}
      {isDeleteDialogOpen && (
        <Dialog
          title="Are You Sure?"
          content=""
          buttons={["No", "Yes"]}
          buttonHandler={buttonHandler}
        >
          <p>Are you sure you want to delete these items?</p>
        </Dialog>
      )}

      {isLoading && <Overlay />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ModelsPage;
