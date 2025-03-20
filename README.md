![p5BrandLab. Generative branding, open to all. Initiated by Multitude.](https://github.com/aidanwyber/p5Generator/blob/main/header.svg?raw=true)

*An open-source project by [Multitude](https://multitude.nl/).*

---

# 🚀 What is p5BrandLab?
**p5BrandLab** is an **open-source generative branding tool** that allows designers, developers, and brands to create **dynamic visual identities** using **p5.js, toxiclibs.js, and ffmpeg.wasm**. 

With p5BrandLab, you can:
- 🎨 Generate brand-consistent visual content programmatically.
- 🏗️ Experiment with **parametric and algorithmic design**.
- 🔄 Automate content generation while maintaining brand identity.
- 📽️ Export high-quality assets for web, print, or motion graphics.

This project is built for **creative coders, developers, and designers** who want to push the boundaries of branding through code.

---

# ✨ Features
✅ **Generative templates** – Define branded elements that evolve dynamically.  
✅ **Flexible customization** – Adjust colors, typography, motion, and shapes in real-time.  
✅ **Modular & expandable** – Build your own brand elements as code modules.
✅ **PNG & SVG exporting** - Save your generated artwork in high-quality formats.
✅ **Video rendering** – Uses **ffmpeg.wasm** for high-quality video exports.
✅ **Works in the browser** – No installation needed, fully web-based.
✅ **Dark mode support** - Defaults to system theme.
✅ **Multi-language support** - Add your own translations.

---

# 📖 Why Open-Source?
At **[Multitude](https://multitude.nl/)**, we believe branding should be **fluid, flexible, and future-proof**. Instead of static logos and locked-in design systems, we embrace **generative branding**—where design systems evolve and adapt in real-time.

**p5BrandLab is our invitation to the creative coding community:** hack, extend, and redefine what branding can be. We encourage experimentation and collaboration—let’s build the future of visual identities, together.

---

# 📥 Installation & Setup
To run p5BrandLab locally, follow these steps:

## 1️⃣ Clone the Repository
```sh
git clone https://github.com/multitude/p5BrandLab.git
cd p5BrandLab
```

## 2️⃣ Start a local development server
```sh
python3 -m http.server 8000
```
or,
```sh
php -S localhost:8000
```
The app will be available at `http://localhost:8000`.

[More on running a web server.](https://gist.github.com/jgravois/5e73b56fa7756fd00b89)

## 3️⃣ Set the generator title in `sketch.js`
```js
const sketchName = '[Brand Name]';
```
## 4️⃣ Create or port your generative sketch in `generator.js`
```js
class Generator {
	...
```
## 5️⃣ Create the GUI elements in `create-gui.js`
```js
...
gui.addController(new ColourBoxes(
	gui, 'colourBoxesBirdCol', 'Bird flock colour', generator.birdPalette, 0,
	(controller, value) => {
		generator.birdCol = value;
	}
));
...

```
## 6️⃣ Customise the styling in `style.css`
```css
:root {
	...
	--gui-base-col: #7685F7;
	...
```

---

# 👨‍💻 Contributing
We welcome contributions! If you’d like to contribute:
1. **Fork** the repository.
2. Create a **Feature branch** (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new GUI component RotatingKnob"`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a **Pull request**!

For larger changes, please open an **Issue** to discuss ideas first.

---

# ❤️‍🔥 Credits
Developed using [p5.js](https://p5js.org/), [toxiclibs.js](https://github.com/hapticdata/toxiclibsjs), and [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm).

---

# 📄 License
This project is licensed under the **MIT License** – free to use and modify.

---

# 📢 Stay Updated
Follow the development and join the discussion:
- Instagram: [@multitudecreativeagency](https://www.instagram.com/multitudecreativeagency/)
- Twitter/X: [@MultitudeStudio](https://twitter.com/MultitudeStudio)
- [Creative Coding Amsterdam Meetup](https://www.meetup.com/nl-NL/creative-coding-amsterdam/)
- GitHub Discussions: [Join the conversation](https://github.com/multitude/p5BrandLab/discussions)

---

💡 **p5BrandLab: Shaping the future of branded creativity—one line of code at a time.**