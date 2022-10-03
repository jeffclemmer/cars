import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Dialog from "../components/Dialog";
import Overlay from "../components/Overlay";
import Toolbar from "../components/Toolbar";
import List from "../components/List";
import ListItem from "../components/ListItem";

// contains the entire page for Models
function ModelsPage(props) {
  const modelInputRef = useRef();
  const yearInputRef = useRef();
  const typeInputRef = useRef();
  const engineInputRef = useRef();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [models, updateModels] = useState([]);

  // get the make passed in as part of the url
  let { make } = useParams();

  // load a make and its models
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/makes/${make}.json`, {});

        if (res.status === 200) {
          const data = await res.json();
          updateModels(data);
        } else {
          console.log("there was a server error");
        }
      } catch (error) {
        /* 
        for whatever reason, if we fetch a make that doesn't exist from our local 
        dev server, instead of returning 404, it returns a 200 and still tries to execute res.json() which then throws an error here...
         */
        console.log("make not found");
      }
    }
    load();
  }, [make]);

  function addItem() {
    setIsAddDialogOpen(true);
  }

  function closeAddDialog() {
    setIsAddDialogOpen(false);
  }

  function addDialogButtonHandler(text) {
    const model = modelInputRef.current.value;
    const year = yearInputRef.current.value;
    const type = typeInputRef.current.value;
    const engine = engineInputRef.current.value;

    if (text === "Save") {
      // normally we would do some deeper form validation here...
      if (make !== "") {
        models.push({
          id: makeId(),
          model: model,
          year: year,
          type: type,
          engine: engine,
        });

        // sort models by name
        models.sort((a, b) => {
          const modelA = a.model.toUpperCase(); // ignore upper and lowercase
          const modelB = b.model.toUpperCase(); // ignore upper and lowercase
          if (modelA < modelB) {
            return -1;
          }
          if (modelA > modelB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        console.log("models:", models);
        updateModels(models);
      }
    }

    if (text === "Update") {
    }

    closeAddDialog();
  }

  function itemCheckboxClickHandler(id, checked) {
    console.log("id:", id, "checked:", checked);
  }

  function editItem(id) {
    console.log("listItem editClick id:", id);
  }

  function deleteItem() {
    setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  function buttonHandler(text) {
    console.log("text:", text);
    closeDeleteDialog();
  }

  return (
    <div>
      <Toolbar
        title={`Car Models - ${make}`}
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
              display={["model", "type", "year", "engine"]}
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
            <input type="text" required id="model" ref={modelInputRef} />
          </div>
          <div>
            <label htmlFor="make">Year</label>
            <input type="text" required id="year" ref={yearInputRef} />
          </div>
          <div>
            <label htmlFor="make">Type</label>
            <input type="text" required id="type" ref={typeInputRef} />
          </div>
          <div>
            <label htmlFor="make">Engine</label>
            <input type="text" required id="engine" ref={engineInputRef} />
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

          <p className="small">(delete is not implemented)</p>
        </Dialog>
      )}
    </div>
  );
}

function makeId() {
  return Math.ceil(Math.random() * 10000);
}

export default ModelsPage;
