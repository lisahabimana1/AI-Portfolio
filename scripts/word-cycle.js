const multilingualWords = [
	{ text: "multilingual", lang: "EN" },
	{ text: "multilingue", lang: "FR" },
	{ text: "meertalig", lang: "NL" },
];

let wordIndex = 0;
let currentText = "multilingual"; // ← track text separately, not from DOM
const multilingualEl = document.getElementById("multilingual-word");

function typeWord(word, lang, callback) {
	let i = 0;
	currentText = "";
	multilingualEl.innerHTML = "";
	const type = setInterval(() => {
		currentText = word.slice(0, i + 1);
		multilingualEl.innerHTML = currentText + `<sup>${lang}</sup>`;
		i++;
		if (i === word.length) {
			clearInterval(type);
			if (callback) setTimeout(callback, 1500);
		}
	}, 80);
}

function eraseWord(callback) {
	const lang = multilingualWords[wordIndex].lang;
	const erase = setInterval(() => {
		currentText = currentText.slice(0, -1); // ← use tracked text, not DOM
		if (currentText.length === 0) {
			multilingualEl.innerHTML = "";
			clearInterval(erase);
			if (callback) callback();
		} else {
			multilingualEl.innerHTML = currentText + `<sup>${lang}</sup>`;
		}
	}, 50);
}

function cycle() {
	wordIndex = (wordIndex + 1) % multilingualWords.length;
	const { text, lang } = multilingualWords[wordIndex];
	typeWord(text, lang, () => eraseWord(cycle));
}

if (multilingualEl) {
	setTimeout(() => eraseWord(cycle), 2000);
}
