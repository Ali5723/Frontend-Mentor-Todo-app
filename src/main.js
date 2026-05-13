const parseLS = () => JSON.parse(localStorage.getItem("tasks"));
const stringifyLS = (data) =>
  localStorage.setItem("tasks", JSON.stringify(data));
const setNewLS = () => {
  let theResult = [];
  document.querySelectorAll(".show li").forEach((item) => {
    theResult.push({
      title: item.querySelector("p").innerText,
      completed: item.className.includes("checked"),
    });
  });
  stringifyLS(theResult);
};

if (!parseLS()) {
  stringifyLS([]);
}

const imgPrefix = () =>
  ["http://localhost:5173", "http://192.168.1.4:5173"].includes(location.origin)
    ? "/images"
    : "/Frontend-Mentor-Todo-app/images";

const searchTitle = () => parseLS().map((item) => item.title);

const recountTasks = () => {
  const theCount = parseLS().filter((item) => !item.completed);
  document.getElementById("counter").innerText = theCount.length;
};

const clearHTMLTasks = () => {
  document
    .querySelectorAll(".show li")
    .forEach((removeItem) => removeItem.remove());
};

const rootData = () => {
  switch (document.querySelector(".tags .selected").innerText.trim()) {
    case "Active":
      return parseLS().filter((item) => !item.completed);
      break;

    case "Completed":
      return parseLS().filter((item) => item.completed);
      break;

    default:
      return parseLS();
      break;
  }
};

const removeTask = (data) => {
  const theSearch = searchTitle();
  const theIndex = theSearch.indexOf(data.title);
  const theResult = parseLS().filter((item, index) => index !== theIndex);

  stringifyLS(theResult);
  showTasks();
};
const checkTask = (data) => {
  removeTask(data);

  const theData = parseLS();
  if (data.completed) {
    data.completed = false;
    theData.push(data);
  } else {
    data.completed = true;
    theData.unshift(data);
  }

  stringifyLS(theData);

  showTasks();
};
const createTask = (data) => {
  const theLI = document.createElement("li");
  data.completed ? theLI.classList.add("checked") : "";
  theLI.setAttribute("draggable", true);

  theLI.addEventListener("dragstart", (event) => {
    const empty = document.createElement("div");
    empty.id = "empty";
    empty.style.width = "0px";
    empty.style.height = "0px";
    document.body.appendChild(empty);
    event.dataTransfer.setDragImage(empty, 0, 0);

    event.target.classList.add("drag");
  });
  theLI.addEventListener("dragover", (event) => {
    const dragElement = document.querySelector(".show li.drag");

    if (dragElement) {
      const theNewOver =
        event.target.localName === "li"
          ? event.target
          : event.target.parentElement;
      if (theNewOver.localName === "li") {
        const theStartIndex = searchTitle().indexOf(
          dragElement.querySelector("p").innerText,
        );
        const theOverIndex = searchTitle().indexOf(
          theNewOver.querySelector("p").innerText,
        );

        if (
          parseLS()[theStartIndex].completed ===
          parseLS()[theOverIndex].completed
        )
          if (theOverIndex !== theStartIndex) {
            const theNextElement = dragElement.nextElementSibling;
            dragElement.remove();
            if (theNewOver === theNextElement) {
              theNewOver.after(dragElement);
            } else {
              theNewOver.before(dragElement);
            }
          }
      }
    }
  });
  theLI.addEventListener("dragend", (event) => {
    document.getElementById("empty").remove();
    event.target.classList.remove("drag");
    setNewLS();
  });

  const theCheck = document.createElement("div");
  theCheck.classList.add("check");
  theCheck.addEventListener("click", () => checkTask(data));
  theLI.append(theCheck);

  const theP = document.createElement("p");
  theP.append(data.title);
  theP.addEventListener("dblclick", () =>
    navigator.clipboard.writeText(data.title),
  );
  theLI.append(theP);

  const theImg = document.createElement("img");
  theImg.src = `${imgPrefix()}/icon-cross.svg`;
  theImg.alt = "icon-cross";
  theImg.addEventListener("click", () => removeTask(data));
  theLI.append(theImg);

  return theLI;
};
const showTasks = () => {
  const theScroll = {
    theX: window.scrollX,
    theY: window.scrollY,
  };
  clearHTMLTasks();
  rootData().forEach((data) => {
    document.querySelector(".show").append(createTask(data));
  });
  recountTasks();
  scrollTo(theScroll.theX, theScroll.theY);
};

const clearLSTasks = () => stringifyLS([]);
document.getElementById("clear").addEventListener("click", () => {
  clearLSTasks();
  clearHTMLTasks();
  recountTasks();
});

showTasks();

document.querySelector("form.insert").addEventListener("submit", (event) => {
  event.preventDefault();
  const theInput = event.target.querySelector("input");
  const inputValue = theInput.value.trim();
  theInput.value = "";
  if (inputValue) {
    const theSearch = searchTitle();
    const isOk = !theSearch.includes(inputValue);
    if (isOk) {
      let theTasks = new Set(parseLS());
      theTasks.add({ title: inputValue, completed: false });
      stringifyLS([...theTasks]);
      showTasks();
    }
  }
});

document.querySelector(".tags").addEventListener("click", (event) => {
  if (
    [...event.target.classList].includes("tags-item") &&
    ![...event.target.classList].includes("selected")
  ) {
    event.target.parentElement
      .querySelector(".selected")
      .classList.remove("selected");
    event.target.classList.add("selected");
    showTasks();
  }
});

// [...document.styleSheets].filter(item=>item.href)[1].disabled = true

const parseTheme = () => JSON.parse(localStorage.getItem("theme"));

const theDarkTheme = [...document.styleSheets].filter(
  (item) => item.href === "http://localhost:5173/src/styles/dark-theme.css",
)[0];
if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", false);
}

const themeImg = document.querySelector(".header .mode img");

if (!parseTheme()) {
  theDarkTheme.disabled = true;
} else {
  themeImg.src = `${imgPrefix()}/icon-sun.svg`;
  themeImg.alt = "icon-sun";
}

themeImg.addEventListener("click", (event) => {
  localStorage.setItem("theme", !parseTheme());

  if (parseTheme()) {
    theDarkTheme.disabled = false;

    event.target.src = `${imgPrefix()}/icon-sun.svg`;
    event.target.alt = "icon-sun";
  } else {
    theDarkTheme.disabled = true;

    event.target.src = `${imgPrefix()}/icon-moon.svg`;
    event.target.alt = "icon-moon";
  }
});
