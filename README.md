[![p5BrandLab. Generative branding, open to all. Initiated by Multitude.](https://github.com/aidanwyber/p5BrandLab/blob/main/p5BrandLab-header.svg?raw=true)](https://multitude.nl/ "Multitude")

<!-- ![GitHub commit activity](https://img.shields.io/github/commit-activity/y/aidanwyber/p5BrandLab) ![GitHub contributors](https://img.shields.io/github/contributors/aidanwyber/p5BrandLab)  -->


# 🧪 What is p5BrandLab?
**p5BrandLab** is an **open-source generative branding tool** that allows **designers, developers, and brands** to create **dynamic visual identities** using **p5.js, toxiclibs.js, and ffmpeg.wasm**.

This project is built for **creative coders, developers, and designers** who want to push the boundaries of professional branding through code.

With **p5BrandLab**, you can generate **professional brand-consistent visual content** by providing **high-quality assets** for web, print, or motion graphics.

See what the p5BrandLab generator looks like [on GitHub pages](https://aidanwyber.github.io/p5BrandLab/).


# ⭐ Features
- **Generative templates**: define branded elements that evolve dynamically.
- **Flexible customization**: adjust colors, typography, motion, and shapes in real-time.
- **Modular & expandable**: the Vanilla JavaScript framework affords adding custom classes and libraries as you go.
- **PNG & SVG exporting**: save your generated artwork in high-quality formats.
- **Video rendering**: uses `ffmpeg.wasm` for high-quality video exports.
- **Works in the browser**: no installation needed, fully web-based.
- **Dark mode support**: defaults to system theme.
- **Multi-language support**: add your own translations.


# 📖 Why Open-Source?
At **[Multitude](https://multitude.nl/)**, we believe branding should be **fluid, flexible, and future-proof**. Instead of static logos and locked-in design systems, we embrace **generative branding**—where design systems evolve and adapt in real-time.

**p5BrandLab is our invitation to the creative coding community:** hack, extend, and redefine what branding can be. We encourage experimentation and collaboration—let’s build the future of visual identities, together.


# 📥 Installation & Setup
To run p5BrandLab locally, follow these steps:

## 1️⃣  Clone the Repository
```sh
git clone https://github.com/aidanwyber/p5BrandLab.git
cd p5BrandLab
```

## 2️⃣  Start a local development server
If you have Python installed:
```sh
python3 -m http.server 8000
```
or if you PHP installed:
```sh
php -S localhost:8000
```
The app will be available at `http://localhost:8000`.

[More on running local web servers.](https://gist.github.com/jgravois/5e73b56fa7756fd00b89)

## 3️⃣  Create or port your generative sketch in `generator.js`
```javascript
class Generator {
	static name = 'Brand Name';
	...
```
## 4️⃣  Create the GUI elements in `create-gui.js`
```javascript
...
gui.addController(new ColourBoxes(
	gui, 'colourBoxesBirdCol', 'Bird flock colour', generator.birdPalette, 0,
	(controller, value) => {
		generator.birdCol = value;
	}
));
...

```
## 5️⃣  Customise the styling in `style.css`
```css
:root {
	...
	--gui-base-col: #7685F7;
	...
```


# 👨‍💻 Contributing
We welcome contributions! If you’d like to contribute:
1. **Fork** the repository.
2. Create a **Feature branch** (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new GUI component RotatingKnob"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a **Pull request**!

For larger changes, please open an **Issue** to discuss ideas first.


# ❤️‍🔥 Credits
Developed initially using [p5.js](https://p5js.org/), [toxiclibs.js](https://github.com/hapticdata/toxiclibsjs), and [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm).


# 📄 License
This project is licensed under the **MIT License** – free to use and modify.


# 📢 Stay Updated
Follow the development and join the discussion:
- Instagram: [@multitudecreativeagency](https://www.instagram.com/multitudecreativeagency/)
- GitHub Discussions: [join the conversation](https://github.com/aidanwyber/p5BrandLab/discussions)
- Creative Coding Amsterdam: [join a Meetup](https://www.meetup.com/nl-NL/creative-coding-amsterdam/) and ask Aidan about this project in person :)

---

**p5BrandLab. Generative branding, open to all.**
