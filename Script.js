let timerRef = document.querySelector(".time-Display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms"); // Corrected selector
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0,
    initialMinute = 0,
    alarmsIndex = 0;

const appendZero = (value) => (value < 10 ? "0" + value : value); // Corrected function name

const searchObject = (parameter, value) => {
    let alarmObject, objIndex, exists = false;
    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists = true;
            alarmObject = alarm;
            objIndex = index;
            return false;
        }
    });
    return [exists, alarmObject, objIndex];
};

function displayTimer() {
    let data = new Date();
    let [hours, minutes, seconds] = [
        appendZero(data.getHours()), // Corrected function name
        appendZero(data.getMinutes()), // Corrected function name
        appendZero(data.getSeconds()) // Corrected function name
    ];
    timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

    alarmsArray.forEach((alarm, index) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHour}:${alarm.alarmMinute}` == `${hours}:${minutes}`) {
                if (!alarmSound.paused) {
                    alarmSound.pause();
                }
                alarmSound.currentTime = 0;
                alarmSound.play();
                alarmSound.loop = true;
            }
        }
    });
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10) {
        inputValue = appendZero(inputValue); // Corrected function name
    }
    return inputValue;
};

hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
    minuteInput.value = inputCheck(minuteInput.value);
});

const createAlarm = (alarmObj) => {
    const { id, alarmHour, alarmMinute } = alarmObj;

    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            startAlarm(e);
        } else {
            stopAlarm(e);
        }
    });
    alarmDiv.appendChild(checkbox);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);

    activeAlarms.appendChild(alarmDiv);
};

setAlarm.addEventListener("click", () => {
    alarmsIndex += 1;

    let alarmObj = {};
    alarmObj.id = `${alarmsIndex}_${hourInput.value}_${minuteInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minuteInput.value;
    alarmObj.isActive = false;
    console.log(alarmObj);
    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initialHour); // Corrected function name
    minuteInput.value = appendZero(initialMinute); // Corrected function name
});

const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = true;
    }
};

const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();
    }
};

const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);
    }
};

window.onload = () => {
    setInterval(displayTimer, 1000);
    initialHour = 0;
    initialMinute = 0;
    alarmsIndex = 0;
    alarmsArray = [];
    hourInput.value = appendZero(initialHour); // Corrected function name
    minuteInput.value = appendZero(initialMinute); // Corrected function name
};
