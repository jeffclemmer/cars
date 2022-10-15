import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Dialog from "../components/Dialog";
import Overlay from "../components/Overlay";
import Toolbar from "../components/Toolbar";
import Loading from "../components/Loading";
import List from "../components/List";
import ListItem from "../components/ListItem";

// contains the entire page for Models
function ModelsPage(props) {
  // const modelInputRef = useRef();
  // const yearInputRef = useRef();
  // const typeInputRef = useRef();
  // const engineInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [models, updateModels] = useState([]);
  const [name, updateName] = useState([]);

  // dialog edit fields
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [engine, setEngine] = useState("");

  // if updating a model, save the current editId
  const [editId, setEditId] = useState("");

  // edit dialog buttons
  const [editButtons, setEditButtons] = useState([]);

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
    setEditId("");
    setModel("");
    setType("");
    setYear("");
    setEngine("");
    setEditButtons(["Cancel", "Save"]);
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }

  async function addDialogButtonHandler(text) {
    if (text === "Cancel") closeAddDialog();

    // const model = modelInputRef.current.value;
    // const year = yearInputRef.current.value;
    // const type = typeInputRef.current.value;
    // const engine = engineInputRef.current.value;

    let url = "";
    let body = {};
    if (text === "Save" || text === "Update") {
      url = "add-model";

      // fill these out on save or update
      body = {
        make: make,
        model: model,
        year: year,
        type: type,
        engine: engine,
      };
    }

    if (text === "Update") {
      // only add/change these if we're updating
      url = "update-model";
      body.id = editId;
    }

    // normally we would do some deeper form validation here...
    if (url && model && year && type && engine) {
      closeAddDialog();
      setIsLoading(true);
      await fetch(`//localhost:3000/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      loadData(make);
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
    let rec = models.find((e) => e.id === id);

    setModel(rec.name);
    setType(rec.type);
    setYear(rec.year);
    setEngine(rec.engine);

    setEditId(id);
    setEditButtons(["Cancel", "Update"]);
    setIsAddDialogOpen(true);
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
          buttons={editButtons}
        >
          <div>
            <label htmlFor="make">
              Model <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="make">
              Year <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="make">
              Type <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="make">
              Engine <span className="required">*</span>
            </label>
            <input
              type="text"
              required
              id="engine"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
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
