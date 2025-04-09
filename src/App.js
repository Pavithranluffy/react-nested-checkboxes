import { useState } from "react";
import "./styles.css";

const CheckBoxData = [
  {
    id: "1",
    name: "Electronics",
    children: [
      {
        id: "1-1",
        name: "Computers",
        children: [
          {
            id: "1-1-1",
            name: "Laptops",
            children: [],
          },
          {
            id: "1-1-2",
            name: "Desktops",
            children: [
              {
                id: "1-1-2-1",
                name: "Gaming PCs",
                children: [],
              },
              {
                id: "1-1-2-2",
                name: "Workstations",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        name: "Mobiles",
        children: [
          {
            id: "1-2-1",
            name: "Smartphones",
            children: [],
          },
          {
            id: "1-2-2",
            name: "Feature Phones",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Home & Kitchen",
    children: [
      {
        id: "2-1",
        name: "Furniture",
        children: [
          {
            id: "2-1-1",
            name: "Beds",
            children: [],
          },
          {
            id: "2-1-2",
            name: "Sofas",
            children: [],
          },
        ],
      },
      {
        id: "2-2",
        name: "Appliances",
        children: [
          {
            id: "2-2-1",
            name: "Microwaves",
            children: [],
          },
          {
            id: "2-2-2",
            name: "Refrigerators",
            children: [
              {
                id: "2-2-2-1",
                name: "Single Door",
                children: [],
              },
              {
                id: "2-2-2-2",
                name: "Double Door",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Books",
    children: [
      {
        id: "3-1",
        name: "Fiction",
        children: [],
      },
      {
        id: "3-2",
        name: "Non-Fiction",
        children: [
          {
            id: "3-2-1",
            name: "Biographies",
            children: [],
          },
          {
            id: "3-2-2",
            name: "Self-help",
            children: [],
          },
        ],
      },
    ],
  },
];

//Let us create a component which just display the node of our CheckBoxData

const CreateCheckBox = ({ nodedata, checked, setChecked }) => {
  // Handles checkbox change event (checked/unchecked)
  const handleCheckboxChange = (node, ischecked) => {
    // Update the 'checked' state
    setChecked((prev) => {
      const newState = { ...prev, [node.id]: ischecked }; // Set the current node's value

      // Step 1: Recursively update all child checkboxes to match the current checkbox state
      const updateChildren = (node) => {
        node.children?.forEach((child) => {
          newState[child.id] = ischecked; // Set child checkbox to same state
          if (child.children?.length > 0) {
            updateChildren(child); // Recurse down to further children
          }
        });
      };
      updateChildren(node);

      // Step 2: Recursively update parent checkboxes based on child checkbox states
      const updateParentState = (node, rootNodes) => {
        // Helper to find a parent node of a given node by ID
        const findParent = (targetId, nodes) => {
          for (let n of nodes) {
            // Check if current node is parent of target
            if (n.children?.some((child) => child.id === targetId)) {
              return n;
            }
            // Recurse into children to search further down
            const found = findParent(targetId, n.children || []);
            if (found) return found;
          }
          return null; // Parent not found
        };

        // Find the parent of the current node
        const parent = findParent(node.id, CheckBoxData);
        if (parent) {
          // Check if all children of the parent are checked
          const allChecked = parent.children.every(
            (child) => newState[child.id]
          );
          newState[parent.id] = allChecked; // Set parent's checkbox based on children
          updateParentState(parent, rootNodes); // Recurse upward to update ancestors
        }
      };
      updateParentState(node, CheckBoxData); // Start parent update process

      return newState; // Return updated checkbox state
    });
  };

  // Render tree of checkboxes recursively
  return (
    <div>
      {nodedata.map((node) => (
        <div className="parent" key={node.id}>
          <div className="node">
            {/* Checkbox input for current node */}
            <input
              type="checkbox"
              checked={checked[node.id] || false} // Bind to state
              onChange={(e) => handleCheckboxChange(node, e.target.checked)} // Trigger handler on change
            />
            <span className="node-name">{node.name}</span>
          </div>

          {/* If node has children, recursively render checkboxes for them */}
          {node.children && node.children.length > 0 && (
            <div className="children">
              <CreateCheckBox
                nodedata={node.children}
                checked={checked}
                setChecked={setChecked}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  //let us create a tracker of checked

  const [checked, setChecked] = useState({});
  return (
    <div className="App">
      <h1>Nested CheckBoxes</h1>
      <CreateCheckBox
        nodedata={CheckBoxData}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
}
