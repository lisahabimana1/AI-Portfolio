window.addEventListener("scroll", () => {
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	const progress = window.scrollY / maxScroll; // 0 at top, 1 at bottom

	// Clamp progress between 0 and 1 (just in case)
	const clampedProgress = Math.min(1, Math.max(0, progress));

	// ── CIRCLE 1 (orange) ──────────────────────────────────────────
	const scale1 = 1 - clampedProgress * 0.85; // shrink amount: 0.85 = shrinks to 15%
	const opacity1 = 1 - clampedProgress * 0.9; // fade amount: 0.9 = fades to 10%
	const circle = document.getElementById("glow-circle");

	// Only apply styles if circle exists
	if (circle) {
		circle.style.width = `${900 * scale1}px`;
		circle.style.height = `${900 * scale1}px`;
		circle.style.opacity = opacity1;
	}

	// ── CIRCLE 2 (blue) ────────────────────────────────────────────
	const scale2 = clampedProgress * 1; // grows from 0 to 1
	const opacity2 = clampedProgress * 0.35; // fades in from 0 to 0.85
	const circle2 = document.getElementById("glow-circle-2");

	if (circle2) {
		circle2.style.width = `${900 * scale2}px`;
		circle2.style.height = `${900 * scale2}px`;
		circle2.style.opacity = opacity2;
	}

	console.log("scrollY:", window.scrollY);
	console.log("maxScroll:", document.body.scrollHeight - window.innerHeight);
	console.log(
		"progress:",
		window.scrollY / (document.body.scrollHeight - window.innerHeight),
	);

	console.log("circle2 found:", circle2);
});

// Also trigger once on page load to set initial state
document.addEventListener("DOMContentLoaded", () => {
	// Trigger scroll event to set initial positions
	window.dispatchEvent(new Event("scroll"));
});
