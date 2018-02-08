let body = document.querySelector('body');
let timer = document.querySelector('.timer');
let startBtn = document.createElement('button');
let bestScoreBlock = document.createElement('div');
let currentScoreBlock = document.createElement('div');
let exerciseBlock = document.querySelector('.exercise');
let container = document.querySelector('.keyboard');
let userExerciseBlock = document.createElement('p');
let bestScore; 
		
body.insertBefore(userExerciseBlock, container);
body.insertBefore(currentScoreBlock, exerciseBlock);
body.insertBefore(bestScoreBlock, currentScoreBlock);
body.insertBefore(startBtn, bestScoreBlock);

timer.classList.add('side-blocks');
timer.classList.add('side-blocks');
startBtn.classList.add('startBtn');
bestScoreBlock.classList.add('best-score');
bestScoreBlock.classList.add('side-blocks');
currentScoreBlock.classList.add('current-score');
currentScoreBlock.classList.add('side-blocks');
startBtn.classList.add('side-blocks');
userExerciseBlock.classList.add('exercise');
userExerciseBlock.classList.add('hidden');

startBtn.textContent = "START";
bestScoreBlock.textContent = `Best Score: `;
currentScoreBlock.textContent = 'Current Score: ';
exerciseBlock.innerHTML = `<p>To start the exercise, please push the START button</p>`;
userExerciseBlock.textContent = 'You pressed: ';
if (localStorage.length != 0) {
	bestScore = localStorage.getItem("bestScore");
	bestScoreBlock.textContent += bestScore;
}

const keyboard = {
		topRow: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
		middleRow: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
		bottomRow: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
		spaceRow:[" "]
};

let timerData = {
  startTime: "",
  currentTime: "",
  id: ""
};

let activeBtn = {
	node: null
}

function createLayout(obj) {
	let res = '';
	let row = '';
	let buttons = '';
	for (let key in obj) {
		let buttonsArr = obj[key].map((elem) => `<div class='keyboard-btn'>${elem}</div>`);
		buttons = buttonsArr.reduce((accum, current) => {
			accum += current;
			return accum;
		});
		if (key == Object.keys(obj)[Object.keys(obj).length - 1]) {
			row = `<div class='row'>${buttons}</div>`;
		} else {
			row = `<div class='row' style='width: ${obj[key].length * 60}px'>${buttons}</div>`;
		}
		res += row;		
	}
	return res;
}
container.innerHTML += createLayout(keyboard);

let buttons = Array.from(document.querySelectorAll('.keyboard-btn'));
let sounds = Array.from(document.querySelectorAll('audio'));

const counter = (function() {
  	let privateCounter = 0;
  	function changeBy(val) {
    	privateCounter += val;
  	}
  	return {
    	increment: function() {
      		changeBy(1);
    	},
    	decrement: function() {
      		changeBy(-1);
    	},
    	value: function() {
      		return privateCounter;
    	}
  	};
})();

window.addEventListener("keydown", function() {
	if (activeBtn.node != null) {
		activeBtn.node.classList.remove('pressed');
		activeBtn.node.classList.remove('pressed-wrong');
	}
	let keyName = event.key;
	if (event.keyCode == 32) {
	   	keyName = 'space';
	}
	if ((exercise.chars.indexOf(keyName) !== -1) || (keyName == 'space')) {
		activeBtn.node = buttons.find(function(el) {
		   	if(el.textContent == keyName) {
		       	return el;
		   	}
		});
		if (keyName == exercise.task[counter.value()]) {
			activeBtn.node.classList.add('pressed');
			userExerciseBlock.textContent += activeBtn.node.textContent;
			counter.increment();
			if (counter.value() > exercise.task.length - 1) {
				stopTimer();
				activeBtn.node.classList.remove('pressed');
				playSound(sounds.find((el) => el.className == 'success'));
				exercise.countKPS();
			}
		} else {
			activeBtn.node.classList.add('pressed-wrong');
			playSound(sounds.find((el) => el.className == 'error'));
		}
	}
});


const exercise = {
	chars: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
	charCount: 0,
	setCharCount: function() {
		let charCountInput;
		let res = 0;
		while (this.checkPositiveInteger(res) === false) {
			charCountInput = prompt("Please enter the number of characters");
			res = Number(charCountInput);
		}
		this.charCount = res;
		return res;
	},
	checkPositiveInteger: function(num) {
		if (num % 1 === 0 && num > 0) {
			return true;
		} else {
		return false;
		}
	},
	task: "",
	createTask: function(){
		let res = [];
		for (let i = 0; i < this.charCount; i++) {
			res.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
		}
		this.task = res.join('');
		exerciseBlock.innerHTML = `<p>Please enter the following text:</p>
									<p>${this.task}</p>`;
	},
	userInput: '',
	startTask: function() {
		startTimer();
		userExerciseBlock.classList.remove('hidden');
	},
	countKPS: function() {
		let userScore = Math.ceil((this.task.length / (time / 1000)) * 100) / 100;
		currentScoreBlock.textContent += `${userScore} keys per second`;
		if ((localStorage.length == 0) || (userScore > bestScore)) {
			bestScore = userScore;
			localStorage.setItem('bestScore', userScore); 
			bestScoreBlock.textContent = `Best Score: ${bestScore}`;
		}
	}
}

const onClick = function() {
	exercise.setCharCount();
	exercise.checkPositiveInteger();
	exercise.createTask();
	exercise.startTask();
};

startBtn.addEventListener("click", onClick);

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function startTimer() {
	resetTimer();
	currentScoreBlock.textContent = "Current Score: ";
	timer.startTime = new Date().getTime();
	timer.id = setInterval(() => {
		timer.currentTime = new Date().getTime();
		time = timer.currentTime - timer.startTime;
		updateTimer(time)
	}, 4);
	return timer;
}
function stopTimer(obj) {
	clearInterval(timer.id);
};
function resetTimer() {
	updateTimer(0);
}
function updateTimer(time) {
	timer.textContent = getFormattedTime(time);
}
function getFormattedTime(time) {
	const date = new Date(time);
  	const mt = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
  	const sc = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
  	const ms = date.getMilliseconds() < 10 ? "00" + date.getMilliseconds() : date.getMilliseconds() < 100 ? "0" + date.getMilliseconds() : date.getMilliseconds();
  	return `${mt}:${sc}:${ms}`;
}