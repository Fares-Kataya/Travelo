
import { createElement } from "../JS/utility.js"
import { toggleActive } from "../JS/utility.js"
export let dateDivFromModal = null;
export function resetDateDivFromModal() {
	dateDivFromModal = null;
}
export let startCalDate, endCalDate
let lowerBound, upperBound;
/**
 * Generates a calendar structure (weeks array) for a given year and month.
 * Each week is an array of 7 items (numbers or null).
 *
 * @param {number|string} year - The year for the calendar.
 * @param {number} month - The month index (0 = January, 11 = December).
 * @returns {Array<Array<number|null>>} The calendar weeks.
 */
export function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let dayCounter = 1;

  let week = new Array(7).fill(null);
  for (let i = firstDay; i < 7; i++) {
    week[i] = dayCounter++;
  }
  weeks.push(week);

  while (dayCounter <= daysInMonth) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      week[i] = dayCounter++;
    }
    weeks.push(week);
  }

  return weeks;
}

/**
 * Renders the calendar into a given container element.
 *
 * @param {Array<Array<number|null>>} weeks - Calendar weeks array.
 * @param {HTMLElement} container - The DOM element where the calendar will be rendered.
 * @param {Function} createElement - A helper function for creating DOM elements.
 * @returns {HTMLElement} The element that holds the calendar.
 */
export function renderCalendar(weeks, dateModal) {
  let monthDaysBlock = createElement("div", [], { id: "monthDays" });

  weeks.forEach((weekArray, weekIndex) => {
    let weekDiv = createElement("div", ["week"], { id: `week${weekIndex}` });

    for (let j = 0; j < 7; j++) {
      let dayValue = weekArray[j];
      let dayDiv;

      if (dayValue) {
        dayDiv = createElement("div", ["day"], { id: `day${weekIndex}${j}` }, dayValue);
      } else {
        dayDiv = createElement("div", ["empty"], { id: `day${weekIndex}${j}` });
      }

      weekDiv.appendChild(dayDiv);
    }

    monthDaysBlock.appendChild(weekDiv);
  });
  dateModal.appendChild(monthDaysBlock);
  return monthDaysBlock;
}

/**
 * Returns the name of the month for a given month index.
 *
 * @param {number} monthIndex - The month index (0-11).
 * @returns {string} The month name.
 */
export function getMonthName(monthIndex) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[(monthIndex % 12 + 12) % 12];
}
/**
 * Clears calendar-related elements from a container.
 *
 * @param {HTMLElement} container - The element from which calendar components should be removed.
 */
export function clearCalendarView(modal) {
  const selectors = [ "#monthDays", "#tripLengthContainer"];
  selectors.forEach(selector => {
    let element = modal.querySelector(selector);
    if (element) modal.removeChild(element);
  });
}
  
export function setupDateModal(overlay) {
    let dateModal = createElement("div", ["date-modal", "container"]);
    let dateOptions = createDateOptions();
    dateModal.appendChild(dateOptions);

    let { monthsDiv, monthHeading, nextButton, backButton } =
      createMonthsSection();
    let daysDiv = createDaysDiv();
    let hr = createElement("hr");

    dateModal.append(monthsDiv, daysDiv, hr);
    let currentMonthIndex = new Date().getMonth();
    let weeks = generateCalendar("2025", currentMonthIndex);
    renderCalendar(weeks, dateModal);

    let actionBtn = createActionButtons();
    dateModal.appendChild(actionBtn);
      let applyBtn = dateModal.querySelector("#apply");
    applyBtn.addEventListener("click", () => {
      if (lowerBound.toString().length < 2) {
        lowerBound = "0" + lowerBound
      } if (upperBound.toString().length < 2) { 
        upperBound = "0" + upperBound
      }
      startCalDate = "2025-" + (currentMonthIndex + 1) + "-" + lowerBound
      endCalDate = "2025-" + (currentMonthIndex + 1) + "-" + upperBound;
        console.log(startCalDate, endCalDate);
			});

    nextButton.addEventListener("click", () => {
      currentMonthIndex = (currentMonthIndex + 1) % 12;
      updateCalendar(dateModal, currentMonthIndex, actionBtn);
      monthHeading.textContent = getMonthName(currentMonthIndex);
      console.log(getMonthName(currentMonthIndex));
    });
    backButton.addEventListener("click", () => {
      currentMonthIndex = (currentMonthIndex + 11) % 12;
      updateCalendar(dateModal, currentMonthIndex, actionBtn);
      monthHeading.textContent = getMonthName(currentMonthIndex);
    });

    let datesButton = dateOptions.querySelector("#datesBtn");
    let tripLengthButton = dateOptions.querySelector("#tripLenBtn");

    tripLengthButton.addEventListener("click", () => {
      toggleActive(tripLengthButton, datesButton);
      clearCalendarView(dateModal);
      renderTripLengthView(dateModal, actionBtn);
    });

    datesButton.addEventListener("click", () => {
      toggleActive(datesButton, tripLengthButton);
      clearCalendarView(dateModal);
      dateModal.append(dateOptions, monthsDiv, daysDiv, hr);
      weeks = generateCalendar("2025", currentMonthIndex);
      renderCalendar(weeks, dateModal);
      dateModal.appendChild(actionBtn);
    });
  overlay.appendChild(dateModal);
  attachDayListeners(dateModal);
    setTimeout(() => dateModal.classList.add("open"), 10);
  }
function attachDayListeners(modal) {
  const daysList = modal.querySelectorAll(".day");
  let selectedStack = [];
  let bounds = [];
  let highlight = [];
  daysList.forEach((day) => {
    day.addEventListener("click", (event) => {
      let selectedNo = document.querySelectorAll(".selected");
      let Month_Days = event.target.parentElement.parentElement;
      // console.log(selectedNo.length)
      if (selectedNo.length < 2) {
        if (!event.target.classList.contains("selected")) {
          event.target.classList.add("selected");
          selectedStack.push(event.target.id);
          // console.log(selectedStack);
        } else {
          event.target.classList.remove("selected");
          selectedStack.splice(selectedStack.indexOf(event.target.id), 1);
        }
      } else if (selectedNo.length === 2 && !event.target.classList.contains("selected")) {
        // console.log(selectedStack);
        const discarded = selectedStack.shift();
        document
          .getElementById(discarded)
          .classList.remove("selected");
        document.getElementById(discarded).classList.remove("highlighter");
          
        highlight.forEach((day) =>
          document
            .querySelectorAll("#monthDays .day, #monthDays .empty")
            .forEach((dayDiv) => {
              dayDiv.classList.remove("highlighter");
            })
        );
        // console.log(selectedStack);
      }
      if (selectedNo.length >= 2) {
        selectedNo.forEach((el) => el.classList.remove("selected"));
        document
          .querySelectorAll("#monthDays .day, #monthDays .empty")
          .forEach((el) => el.classList.remove("highlighter"));
        // Reset our tracking arrays
        selectedStack = [];
        bounds = [];
        highlight = [];
      }
      if (selectedNo.length + 1 === 2) {
        let updatedSelected = document.querySelectorAll(".selected");
        updatedSelected.forEach((day) => bounds.push(day.innerHTML));
      }
      lowerBound = bounds.shift();
      upperBound = bounds.shift();

      highlight.push(lowerBound);
      console.log(lowerBound, upperBound);
      console.log(event.target.parentElement.parentElement);
      document
        .querySelectorAll("#monthDays .day, #monthDays .empty")
        .forEach((dayDiv) => {
          // console.log(lowerBound, upperBound);
          if (
            parseInt(dayDiv.innerHTML) > parseInt(lowerBound) &&
            parseInt(dayDiv.innerHTML) < parseInt(upperBound)
          ) {
            highlight.push(dayDiv.innerHTML);
          }
        });
      highlight.push(upperBound);
      highlight.forEach((day) =>
        document
          .querySelectorAll("#monthDays .day, #monthDays .empty")
          .forEach((dayDiv) => {
            if (parseInt(dayDiv.innerHTML) === parseInt(day)) {
              dayDiv.classList.add("highlighter");
            }
          })
      );
    });
  });
}
  function createDateOptions() {
    let header = createElement("h2", [], {}, "Add dates or Trip Length");
    let datesButton = createElement(
      "button",
      ["active-date"],
      { id: "datesBtn" },
      "Dates(MM/DD)"
    );
    let tripLengthButton = createElement(
      "button",
      ["inactive-date"],
      { id: "tripLenBtn" },
      "Trip Length"
    );
    let buttonsDiv = createElement("div", ["container"], {
      id: "date-options-buttons",
    });
    buttonsDiv.append(datesButton, tripLengthButton);

    let dateOptions = createElement("div", ["container"], {
      id: "date-options",
    });
    dateOptions.append(header, buttonsDiv);
    return dateOptions;
  }
  function createMonthsSection() {
    let monthsDiv = createElement("div", [], { id: "months" });
    let backImg = createElement("img", [], {
      src: "../Assets/icons/back-svgrepo-com.svg",
    });
    let backButton = createElement("button", [], {});
    backButton.appendChild(backImg);

    let monthHeading = createElement(
      "h4",
      [],
      {},
      getMonthName(new Date().getMonth())
    );
    let nextImg = createElement("img", [], {
      src: "../Assets/icons/next-svgrepo-com.svg",
    });
    let nextButton = createElement("button", [], {});
    nextButton.appendChild(nextImg);

    monthsDiv.append(backButton, monthHeading, nextButton);
    return { monthsDiv, monthHeading, nextButton, backButton };
  }
  function createDaysDiv() {
    let daysDiv = createElement("div", [], { id: "weekdays" });
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach((day) => {
      let dayDiv = createElement("div", ["weekDaysDivs"], { id: day }, day);
      daysDiv.appendChild(dayDiv);
    });
    return daysDiv;
  }
  function createActionButtons() {
    let actionBtn = createElement("div", ["action-btns"]);
    let clearBtn = createElement(
      "button",
      ["clear"],
      { id: "clear-days" },
      "Clear"
    );
    let applyBtn = createElement("button", ["apply"], { id: "apply" }, "Apply");
    actionBtn.append(clearBtn, applyBtn);
    return actionBtn;
  }
  function updateCalendar(modal, monthIndex, actionBtn) {
    clearCalendarView(modal);
    let weeks = generateCalendar("2025", monthIndex);
    renderCalendar(weeks, modal);
  attachDayListeners(modal);
    modal.appendChild(actionBtn);
  }
 function renderTripLengthView(modal, actionBtn) {
    let TLcontainer = createElement("div", ["container"], {
      id: "tripLengthContainer",
    });
    let TLheader = createElement("h5", [], {}, "Number of Days");
    let pmDays = createElement("div", [], { id: "pmDays" });
    let daysContainer = createElement("div", [], { id: "daysContainer" });
    let days = createElement("p", [], {}, "0");
    daysContainer.appendChild(days);

    let plusButton = createElement("button", ["tripLenBtn"], {}, "+");
    let minusButton = createElement("button", ["tripLenBtn"], {}, "-");
    pmDays.append(minusButton, daysContainer, plusButton);

    TLcontainer.append(TLheader, pmDays);
    modal.appendChild(TLcontainer);
    modal.appendChild(actionBtn);

    plusButton.addEventListener("click", () => {
      days.textContent = parseInt(days.textContent) + 1;
    });
    minusButton.addEventListener("click", () => {
      if (parseInt(days.textContent) > 0) {
        days.textContent = parseInt(days.textContent) - 1;
      }
    });

    let applyBtn = actionBtn.querySelector("#apply");
    let clearBtn = actionBtn.querySelector("#clear-days");
    applyBtn.addEventListener("click", () => {
      let dayCount = days.textContent;
      let calIcon = createElement("img", [], {
        id: "calendar-icon",
        src: "../Assets/icons/calendar.png",
      });
      let tripLengthPara = createElement("p", [], {}, `${dayCount} days`);
      trip.daysPara = tripLengthPara.innerHTML;
      let dateDiv = createElement("div", [], { id: "date" });
      dateDiv.append(calIcon, tripLengthPara);
      dateDivFromModal = dateDiv;
      let currentModal = document.querySelector(".date-modal");
      if (currentModal) {
        currentModal.classList.remove("open");
        setTimeout(() => currentModal.remove(), 300);
      }
    });
    clearBtn.addEventListener("click", () => {
      days.textContent = "0";
    });
  }