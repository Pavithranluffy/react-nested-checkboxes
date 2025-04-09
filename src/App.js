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
  const handleCheckboxChange = (node, ischecked) => {
    setChecked((prev) => {
      const newState = { ...prev, [node.id]: ischecked };

      // Update all children recursively
      const updateChildren = (node) => {
        node.children?.forEach((child) => {
          newState[child.id] = ischecked;
          if (child.children?.length > 0) {
            updateChildren(child);
          }
        });
      };
      updateChildren(node);

      // Update all parents recursively based on child states
      const updateParentState = (node, rootNodes) => {
        const findParent = (targetId, nodes) => {
          for (let n of nodes) {
            if (n.children?.some((child) => child.id === targetId)) {
              return n;
            }
            const found = findParent(targetId, n.children || []);
            if (found) return found;
          }
          return null;
        };

        const parent = findParent(node.id, rootNodes);
        if (parent) {
          const allChecked = parent.children.every(
            (child) => newState[child.id]
          );
          newState[parent.id] = allChecked;
          updateParentState(parent, rootNodes);
        }
      };
      updateParentState(node, CheckBoxData);

      return newState;
    });
  };

  return (
    <div>
      {nodedata.map((node) => (
        <div className="parent" key={node.id}>
          <div className="node">
            <input
              type="checkbox"
              checked={checked[node.id] || false}
              onChange={(e) => handleCheckboxChange(node, e.target.checked)}
            />
            <span className="node-name">{node.name}</span>
          </div>

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
