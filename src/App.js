import React, { useState, useMemo, useEffect } from "react";
import update from "immutability-helper";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const [filteredTasks, setFilteredTasks] = useState([]);

  const itemsLeft = useMemo(
    () => filteredTasks.filter((x) => !x.completed).length,
    [filteredTasks]
  );

  useEffect(() => {
    if (selectedTab === "all") {
      setFilteredTasks(tasks);
      return;
    }
    if (selectedTab === "active") {
      setFilteredTasks(tasks.filter((task) => !task.completed));
      return;
    }

    setFilteredTasks(tasks.filter((task) => task.completed));
  }, [selectedTab, setFilteredTasks, tasks]);

  const addTask = (key) => {
    if (key === "Enter") {
      setTasks(
        update(tasks, {
          $push: [
            {
              id: Math.floor(Math.random() * 1000),
              task: inputValue,
              completed: false,
            },
          ],
        })
      );
      setInputValue("");
    }
  };

  return (
    <div className={`wrapper theme-${darkMode ? "dark" : "light"}`}>
      <header>
        <div className="head-content">
          <div className="main-row">
            <h1>TODO</h1>
            <div
              className="toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
            ></div>
          </div>
          <span className="input-cheat"></span>
          <input
            type="text"
            placeholder="Create a new todo..."
            className="input"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyDown={(e) => addTask(e.key)}
          />
        </div>
      </header>
      <div className="main-container">
        <div className="task-container">
          {filteredTasks.length && filteredTasks.length > 0 ? (
            filteredTasks.map(({ id, task, completed }, index) => (
              <div className="task-row" key={id} draggable={true}>
                <div
                  className={`task-status ${completed ? "completed" : ""}`}
                  onClick={() => {
                    setTasks(
                      update(tasks, {
                        [index]: {
                          $set: { ...tasks[index], completed: !completed },
                        },
                      })
                    );
                  }}
                ></div>
                <p>{task}</p>
                <div
                  className="close"
                  onClick={() => {
                    setTasks(
                      update(tasks, {
                        $splice: [[index, 1]],
                      })
                    );
                  }}
                ></div>
              </div>
            ))
          ) : (
            <div className="task-row task-row-empty">
              <p>List is emtpy</p>
            </div>
          )}
          <div className="filter-row">
            <div className="task-count">{itemsLeft} items left</div>
            <div className="filter-container">
              <div
                className={`filter-item ${
                  selectedTab === "all" ? "active" : ""
                }`}
                onClick={() => setSelectedTab("all")}
              >
                All
              </div>
              <div
                className={`filter-item ${
                  selectedTab === "active" ? "active" : ""
                }`}
                onClick={() => setSelectedTab("active")}
              >
                Active
              </div>
              <div
                className={`filter-item ${
                  selectedTab === "completed" ? "active" : ""
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Completed
              </div>
            </div>
            <div
              className="clear-completed"
              onClick={() => {
                if (selectedTab === "completed") return;
                const arr = [...tasks];
                const uncompleted = arr.filter((x) => !x.completed);
                setTasks(
                  update(tasks, {
                    $set: uncompleted,
                  })
                );
              }}
            >
              Clear completed
            </div>
          </div>
        </div>
        <footer>Drag and drop to reorder list</footer>
      </div>
    </div>
  );
}

export default App;
