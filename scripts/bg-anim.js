window.addEventListener("scroll", () => {
	const maxScroll = document.body.scrollHeight - window.innerHeight;
	const progress = window.scrollY / maxScroll; // 0 at top, 1 at bottom

	const scale = 1 - progress * 0.85; // shrinks to 15% of original
	const opacity = 1 - progress * 0.9; // fades out almost completely

	const circle = document.getElementById("glow-circle");
	circle.style.transform = `translate(-50%, -50%) scale(${scale})`;
	circle.style.opacity = opacity;
});
