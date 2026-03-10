// ============================================================
// PAPER.JS CANVAS SETUP
// Uses Paper.js for vector graphics on #myCanvas element
// ============================================================
paper.setup("myCanvas");

// Load profile image as a raster (pixel-based) element
var raster = new paper.Raster("./assets/lisa-profile-pic.png");
var loaded = false;

raster.on("load", function () {
	loaded = true;
	onResize(); // trigger initial render once image is ready
});

raster.visible = false; // hidden — only used as a color source
var lastPos = paper.view.center;

// ============================================================
// MOVE HANDLER — called when mouse moves over a rectangle
// Splits the rectangle into 2 smaller ones filled with the
// average color of the image at that region → creates a
// progressive pixelation / mosaic reveal effect
// ← TO REVEAL FASTER: lower the distance threshold (line below)
//   or increase split frequency by reducing rectangle size
// ============================================================
function moveHandler(event) {
	if (!loaded) return;

	// ← SPEED TWEAK: lower number = reacts to smaller movements = faster reveal
	if (lastPos.getDistance(event.point) < 1) return;
	lastPos = event.point;

	var size = this.bounds.size.clone();
	var isLandscape = size.width > size.height;

	// Split rectangle in half — landscape splits horizontally, portrait vertically
	size.width = Math.ceil(size.width / (isLandscape ? 2 : 1));
	size.height = Math.ceil(size.height / (isLandscape ? 1 : 2));

	// First half — filled with average color from image at this region
	var path1 = new paper.Path.Rectangle({
		point: this.bounds.topLeft,
		size: size,
		onMouseMove: moveHandler, // each new rect also listens → recursive subdivision
	});
	path1.fillColor = raster.getAverageColor(path1);

	// Second half — same logic for the other half
	var path2 = new paper.Path.Rectangle({
		point: isLandscape ? this.bounds.topCenter : this.bounds.leftCenter,
		size: { width: Math.floor(size.width), height: Math.floor(size.height) },
		onMouseMove: moveHandler,
	});
	path2.fillColor = raster.getAverageColor(path2);

	this.remove(); // remove the parent rect — replaced by the two children
}

// ============================================================
// ON RESIZE — resets canvas and creates one big starting rectangle
// covering the full viewport, filled with the image's avg color
// This is the "blank state" before the user starts moving the mouse
// ============================================================
function onResize(event) {
	if (!loaded) return;
	paper.project.activeLayer.removeChildren();
	paper.view.size = new paper.Size(window.innerWidth, window.innerHeight);
	raster.fitBounds(paper.view.bounds, true);

	// ← Grid of starting tiles instead of one big rectangle
	// Increase cols for smaller tiles = faster reveal
	var cols = 10;
	var tileW = paper.view.size.width / cols;
	var rows = Math.ceil(paper.view.size.height / tileW);

	for (var x = 0; x < cols; x++) {
		for (var y = 0; y < rows; y++) {
			var rect = new paper.Path.Rectangle({
				point: new paper.Point(x * tileW, y * tileW),
				size: new paper.Size(tileW, tileW),
				onMouseMove: moveHandler,
			});
			rect.fillColor = raster.getAverageColor(rect);
		}
	}
}

window.addEventListener("resize", onResize);
onResize();

function scrollToContent() {
	document.getElementById("mainContent").scrollIntoView({
		behavior: "smooth",
	});
}

const greetings = [
	"Hello",
	"Hola",
	"Bonjour",
	"Ciao",
	"Hallo",
	"Olá",
	"Привет",
	"你好",
	"こんにちは",
	"안녕하세요",
	"Merhaba",
	"नमस्ते",
	"01001000 01001001",
	"Sawubona",
	"Molo",
	"Jambo",
	"Salam",
	"Bawo ni",
	"Dumela",
	"Kóyí",
	"Sannu",
	"Nnọọ",
	"Akwabaa",
	"Mhoro",
	"Sanibonani",
	"Salut",
	"Coucou",
	"Yo",
	"Hi there!",
	"Greetings",
	"Dag",
	"Gutentag",
	"Aiya",
	"01001000 01001001",
	"Wah Gwaan",
];

const textmoji = [
	"꒰ · ◡ · ꒱",
	"⊂◉‿◉つ",
	"ヽ(•‿•)ノ",
	"（＾ω＾）",
	"⊂ ◉ ‿ ◉ つ",
	"｡^‿^｡",
	"(＊๑˘◡˘)",
	"ʘ ‿ ʘ",
	"(ᴗᵔᴥᵔ)",
	"♡´･ᴗ･`♡",
	"≧ ◡ ≦",
	"ʕ·ᴥ·ʔ",
	"(⊙‿⊙ ✿)",
	" ヅ ",
	"❀ ‿ ❀",
	"✿ ｡ ✿",
	"☆(◒‿◒)☆",
	"( ಠ◡ಠ )",
	"^‿^",
	"(▰˘◡˘▰)",
	"{◕ ◡ ◕}",
	"｡◕‿◕｡",
];

// Function to generate a random color
// Used to colorize the textmoji on click
function getRandomColor() {
	const greenPinkBlackshades = [
		"#1f48ff", // Blue accent
		"#1f48ffb8", // accent-mild
		"#1f48ff5b", // accent-light
		"#1f48ff41", // accent-faint
		"#fbf4e9", // Orange/beige
		"#000000", // Black
		"#1f48ff", // Blue accent
		"#1f48ffb8", // accent-mild
		"#1f48ff", // Blue accent
		"#1f48ffb8", // accent-mild
	];
	return greenPinkBlackshades[
		Math.floor(Math.random() * greenPinkBlackshades.length)
	];
}

// ============================================================
// CLICK HANDLER — on every click, spawns a random greeting word
// and a textmoji at random positions on the canvas
// Both fade out after 2 seconds via tween opacity animation
// ============================================================

document.addEventListener("click", function (event) {
	const greeting = greetings[Math.floor(Math.random() * greetings.length)];
	const emoji = textmoji[Math.floor(Math.random() * textmoji.length)];
	const greenColor = getRandomColor();

	// greeting text
	const greetingText = new paper.PointText({
		point: new paper.Point(
			Math.random() * paper.view.size.width,
			Math.random() * paper.view.size.height,
		),
		content: greeting,
		fillColor: "black",
		fontFamily: "Arial",
		fontWeight: "bold",
		fontSize: 30,
	});

	// text moji with random color
	const emojiText = new paper.PointText({
		point: new paper.Point(
			Math.random() * paper.view.size.width,
			Math.random() * paper.view.size.height,
		),
		content: emoji,
		fillColor: greenColor,
		fontFamily: "Arial",
		fontWeight: "bold",
		fontSize: 40,
	});

	// fade-out effects
	greetingText.tween({ opacity: 0 }, 2000);
	emojiText.tween({ opacity: 0 }, 2000);
});

/* 
// DISABLED — alternative click interaction
// Originally showed alternating "let's code" images on click
// Kept for reference — press R/Backspace/Delete to clear images
*/

/* 
// Let's work CTA
let currentImage = 0;  
const images = [];  // Store references to the images

document.addEventListener('click', function(event) {
    const mousePosition = new paper.Point(event.clientX, event.clientY);
    
    const imageFile = currentImage === 0 ? './assets/letuscode.png' : './assets/letscode.png';
    
    const image = new paper.Raster(imageFile);
    image.position = mousePosition;
    image.opacity = 0;  
    image.tween({ opacity: 1 }, 5);  
    
    images.push(image); 

    // Toggle between the two images
    currentImage = currentImage === 0 ? 1 : 0;
});

// Listen for "R" key press to remove images
document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R' || event.key === 'Backspace' || event.key === 'Delete') {  
        images.forEach(img => img.remove());  
        images.length = 0;  
    }
});
 */
