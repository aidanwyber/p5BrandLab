
function createGUI() {
  if (gui != undefined) gui.div.remove();
  gui = new GUIForP5();
  gui.setLeft();
  // gui.setRight();
  
  let logo = gui.addImage('data/generator-logo.svg', 'Logo');
  logo.div.child()[0].style.height = '3.5em';
  // logo.div.child()[0].style.margin = '0.5rem 0';


  gui.addTitle(2, 'LANG_FORMAT', false);
  gui.addController(new ResolutionSelect(
    gui, 'Presets:', 0,
    (controller, value) => {
      const resBox = gui.getController('resolutionTextboxes');
      if (resBox) resBox.setValueOnlyDisplay(pw, ph);
      generator.init();
    }
  ));
  gui.addController(new ResolutionTextboxes(
    gui, pw, ph,
    (controller, value) => {
      if (value.w * value.h < sq(10000) && (value.w != pw || value.h != ph)) {
        generator.init();
      }
    }
  ));
  
  gui.addDivider();

  gui.addTitle(2, 'LANG_APPEARANCE', false);
  gui.addController(new ColourBoxes(
    gui, 'colourBoxesFgCol', 'LANG_FGCOL', generator.palette, 0,
    (controller, value) => {
      generator.col = value;
    }
  ));
  gui.addController(new Button(
    gui, 'buttonRandomize', 'LANG_RANDOMIZE',
    (controller) => {
      gui.getControllers(
        'colourBoxesFgCol'.split(',')
      ).forEach(controller => controller.randomize());
      // generator.init();
    },
    (controller) => {
      controller.click();
    }
  ));

  gui.addDivider();

  gui.addTitle(2, 'LANG_IMAGE', false);
  gui.addController(new Toggle(
    gui, 'toggleShowImage',
    'LANG_HIDE LANG_IMAGE', 'LANG_SHOW LANG_IMAGE', generator.doShowImage,
    (controller, value) => {
      generator.doShowImage = value;
      gui.getControllers(
        'imageLoader,sliderImageScale,xyImagePosition,sliderImageX,sliderImageY'.split(',')
      ).forEach(controller => 
        generator.doShowImage ? controller.show() : controller.hide()
      );
    }
  ));
  gui.addController(new ImageLoader(
    gui, 'LANG_SELECT LANG_IMAGE...',
    (controller, img) => {
      if (img instanceof p5.Image && img.isLoaded) return;
      if (img instanceof p5.Element && img.isLoaded) {
        // check if img isn't default image
        img.elt.onload();
        return;
      }
      print('Loading image...');
      img.elt.onload = () => {
        img.isLoaded = true;
        print('Image loaded.');
        const minW = floor(pw / (1 + maxImgResIncrease));
        const minH = floor(ph / (1 + maxImgResIncrease));
        if (img.width < minW || img.height < minH) {
          controller.setWarning(`Kleiner dan minimum afmetingen: ${minW} x ${minH} pixels.`);
          alert(`De afmetingen van de afbeelding (${img.width} x ${img.height}) ` + 
            `zijn te laag voor een mooi optisch effect.\n` + 
            `Kies een afbeelding van ten minste ${minW} x ${minH} pixels.`);
        } else {
          controller.setConsole(controller.fileName, '');
        }
        generator.setImage(img);
        gui.getController('toggleShowImage').setValue(true);
      };
    }
  ));
  // gui.addController(new Toggle(
  //   gui, 'Contain', 'Cover', generator.doFillImage,
  //   (controller, value) => {
  //     generator.doFillImage = controller.isToggled;
  //   }));
  gui.addController(new Slider(
    gui, 'sliderImageScale', 'LANG_SCALE LANG_IMAGE',
    -1, 1, 0, 0.001,
    (controller, value) => {
      generator.imageScale = pow(2, value);
    }
  ));

  gui.addController(new XYSlider(
    gui, 'xyImagePosition', 'LANG_IMAGE_POSITION', 
    -1, 1, 0, 0.001,
    -1, 1, 0, 0.001,
    (controller, value) => {
      generator.imagePosition.set(-value.x, -value.y);
    }));

  gui.addDivider();

  gui.addTitle(2, 'LANG_EXPORT', false);
  gui.addController(new Button(
    gui, 'buttonDownloadPNG', 'Download PNG',
    (controller) => {
      save(getOutputFileName() + '.png');
    }
  ));
  // gui.addController(new Button(
  //   gui, 'buttonDownloadSVG', 'Download SVG',
  //   (controller) => {
  //     generator.draw(doSVGToo=true);
  //     svgCanvas.save(getOutputFileName() + '.svg');
  //   }
  // ));

  gui.addDivider();

  gui.addController(new Slider(
    gui, 'sliderSpeed', 'LANG_SPEED',
    0.25, 2, 1, 0.25,
    (controller, value) => {
      generator.speedMultiplier = value;//pow(2, value * 2);
      controller.label.div.html(lang.process(`LANG_SPEED: ${generator.speedMultiplier} x`, true));
    }
  ));

  gui.addController(new Slider(
    gui, 'sliderVidDuration', 'LANG_VID_DURATION',
    1, 30, round(duration), 1,
    (controller, value) => {
      setDuration(value);
      controller.label.div.html(lang.process(`LANG_VID_DURATION: ${value} s`, true));
    }
  ));
  // ffmpeg.js var 
  guiCaptureButton = gui.addController(new Button(
    gui, 'buttonVidCapture', lang.process('Start LANG_VID_CAPTURE'),
    (controller) => {
      ///
      if (!isCapturingFrames) {
        startCapture();
        controller.controllerElement.html(lang.process('Stop LANG_VID_CAPTURE'));
      } else {
        stopCapture();
        controller.controllerElement.html(lang.process('Start LANG_VID_CAPTURE'));
        clearFramesDir();
        isPlaying = true;
      }
    }
  ));
  // ffmpeg.js var 
  guiVideoLoadingDiv = gui.addField(new Field(gui.div, 'vidLoad', '', 'Video verwerken...'));
  guiVideoLoadingDiv.div.hide();
  let loaderDiv = createDiv();
  loaderDiv.parent(guiVideoLoadingDiv.div);

  gui.addDivider();

  let contactDiv = createDiv(lang.process(
    `<a href="mailto:aidan.wyber@multitude.nl` + 
    `?subject=${sketchName}` + 
    `">LANG_CONTACT_MSG</a>`
  ));
  contactDiv.id('contact');
  contactDiv.parent(gui.div);


  // auto click buttons for initialisation
  gui.getController('buttonRandomize').click();

  const resBox = gui.getController('resolutionTextboxes');
  if (resBox) resBox.setValueOnlyDisplay(pw, ph);

  gui.getControllers('imageLoader,sliderImageScale,sliderImageX,sliderImageY'.split(',')).forEach(
    controller => generator.doShowImage ? controller.show() : controller.hide()
  );
}
