
import { createElement } from "../JS/utility.js"
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
  const selectors = ["#weekdays", "#monthDays", "#tripLengthContainer"];
  selectors.forEach(selector => {
    let element = modal.querySelector(selector);
    if (element) modal.removeChild(element);
  });
	}