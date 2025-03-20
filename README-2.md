# p5Generator
 
p5Generator is a dynamic and customizable visual generator built using [p5.js](https://p5js.org/), [toxiclibs.js](https://github.com/hapticdata/toxiclibsjs), and [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm). This tool allows users to create and manipulate graphics, images, and animations interactively via a user-friendly GUI.

## Features

- Customizable Image Processing: Load and manipulate images with scaling, positioning, and effects.
- Interactive GUI: A feature-rich interface allowing real-time modifications and parameter adjustments.
- Resolution presets & custom dimensions
- SVG & PNG Export: Save your generated artwork in high-quality formats.
- Video Capture & Export: Utilize ffmpeg.js to create videos from generated frames.
- Live Shader Rendering: Uses WebGL for enhanced visual effects.
- Multi-Language Support: Built-in language dictionary for localization.
- Dark mode support (defaults to system theme)

## Installation

### Prerequisites
Ensure you have a web server running, as some browser security policies restrict loading local files (like images and fonts). You can use Python’s simple server:

`python3 -m http.server`

### Steps
Clone this repository:

`git clone https://github.com/your-repo/generator-project.git`

Navigate to the project folder:

`cd generator-project`

Start a local server and open `index.html` in a browser.

## Usage
1. Open the index.html file in a browser.
2. Use the GUI panel to modify generator parameters.
3. Export images as PNG/SVG or capture video output.

## File Structure
- `index.html` - Entry point of the project.
- `style.css` - Styles for the interface.
- `generator.js` - Core logic for procedural generation.
- `create-gui.js` - Manages GUI components and interactions.
- `sketch.js` - p5.js setup and main drawing loop.
- `ffmpeg.js` - Handles video export functionalities.
- `util.js`, `util-maths.js` - Utility functions for calculations and transformations.
- `lang.js` - Handles multi-language support.

## Customization
- Modify generator.js to define new visual styles or effects.
- Extend create-gui.js to add new interactive controls.
- Update style.css for UI customization.

## Credits
Developed using [p5.js](https://p5js.org/), [toxiclibs.js](https://github.com/hapticdata/toxiclibsjs), and [ffmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm).

## License
MIT License - Feel free to use and modify this project as needed.