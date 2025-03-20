
class Generator {
	static name = 'p5BrandLab';

	palette = [
		color('#FEFDFB'), // white
		color('#F9EFE6'), // off-white
		color('#5E1B30'), // dark red
		color('#2F0D17'), // rich black
		randCol(),
	];

	constructor() {
		this.doShowImage = false;
		this.doDrawBackground = true;

		this.col = undefined;

		this.img = undefined;
		this.imageScale = 1;
		this.imagePosition = new Vec2D(0, 0);
	}


	init() {}


	setImage(img) {
		this.img = img;
	}


	update() {}


	draw(doSVGToo=false) {
		this.doSVGToo = doSVGToo;

		clear();

		if (this.doShowImage) this.drawImg();

		noStroke();
		fill(this.col);
		circle(pw / 2, ph / 2 + sin(time) * 200, min(pw, ph) / 2);
	}


	drawImg() {
		if (this.img == undefined) return;
		push();
		{
			const imgDelta = min(pw, ph);
			translate(-this.imagePosition.x * imgDelta, -this.imagePosition.y * imgDelta);
			scale(this.imageScale);
			imageCenteredXY(this.img, true, 0, 0, this.imageScale);
		}
		pop();
	}


	// setShaderUniforms() {
	// 	theShader.setUniform("SSIDHash", SSID / 1e8);
	// 	theShader.setUniform("scrollVal", scrollScale);
	// 	theShader.setUniform("camOrigin", [0.0, 0.0]);
	// 	theShader.setUniform("camScale", 1.0);
	// 	theShader.setUniform("camPan", [0.0, 0.0]);
	// 	theShader.setUniform("utilBools", utilBools);
	// 	theShader.setUniform("K", K);
	// 	theShader.setUniform("resolution", [pw, ph]);
	// 	theShader.setUniform("time", time * duration / 10 * this.speedMultiplier + timeOffset);
	// 	theShader.setUniform("mouse", [mouseY, mouseY, mouseIsPressed ? 1.0 : 0.0]);
	// }
	// drawShader() {
	//   resetMatrix();
	//   shader(theShader);
	//   rectMode(CENTER);
	//   noStroke();
	//   blendMode(BLEND);
	//   rect(0, 0, width, height);
	// }
}


