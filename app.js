const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");
const imageWrapper = document.querySelector("#imageWrapper");

const fileUpload = document.querySelector("#fileUpload");
const fileUploadButton = document.querySelector("#fileUploadButton");

const image = document.querySelector("#image");

heightInput.addEventListener("change", (evt) => {
  const newHeight = parseInt(evt.target.value);
  imageWrapper.style.height = `calc(${newHeight}px * 5)`;
});
widthInput.addEventListener("change", (evt) => {
  const newWidth = parseInt(evt.target.value);
  imageWrapper.style.width = `calc(${newWidth}px * 5)`;
});

heightInput.dispatchEvent(new Event("change"));
widthInput.dispatchEvent(new Event("change"));

fileUploadButton.addEventListener("click", () => fileUpload.click());
fileUpload.addEventListener("change", (evt) => {
  const file = evt.target.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    image.src = reader.result;
    fileUploadButton.style.display = "none";
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    img.src = "";
  }
});

// options slider
const scale = document.querySelector("#scale");
const offsetX = document.querySelector("#offsetX");
const offsetY = document.querySelector("#offsetY");

// default: object-fit: cover
var defaultScale;
function applyDefaultScale() {
  const { width, height } = imageWrapper.getBoundingClientRect();
  defaultScale = getObjectFitSize(
    false,
    width - 1,
    height - 1,
    image.width,
    image.height
  );
  console.log(defaultScale);
  image.style.height = defaultScale.height + "px";
  image.style.width = defaultScale.width + "px";
  image.style.left = defaultScale.x + "px";
  image.style.top = defaultScale.y + "px";
}
image.addEventListener("load", applyDefaultScale)
document.querySelector("#centerDefault").addEventListener("click", () => {
  image.style.scale = null;
  scale.value = 50;
  offsetX.value = 50;
  offsetY.value = 50;
  applyDefaultScale();
});

scale.addEventListener("change", (evt) => {
  const val = (parseInt(evt.target.value) / 100) * 2;
  image.style.scale = val;
});

offsetX.addEventListener("change", (evt) => {
  const val = (parseInt(evt.target.value) - 50) * 2;
  image.style.left = defaultScale.x + val + "px";
});

offsetY.addEventListener("change", (evt) => {
  const val = (parseInt(evt.target.value) - 50) * 2;
  image.style.top = defaultScale.y + val + "px";
});

// adapted from: https://www.npmjs.com/package/intrinsic-scale
function getObjectFitSize(
  contains /* true = contain, false = cover */,
  containerWidth,
  containerHeight,
  width,
  height
) {
  var doRatio = width / height;
  var cRatio = containerWidth / containerHeight;
  var targetWidth = 0;
  var targetHeight = 0;
  var test = contains ? doRatio > cRatio : doRatio < cRatio;

  if (test) {
    targetWidth = containerWidth;
    targetHeight = targetWidth / doRatio;
  } else {
    targetHeight = containerHeight;
    targetWidth = targetHeight * doRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    x: (containerWidth - targetWidth) / 2,
    y: (containerHeight - targetHeight) / 2,
  };
}

// download
const downloadButton = document.querySelector("#download");

downloadButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const {width: canvasWidth, height: canvasHeight} = window.getComputedStyle(imageWrapper)

  canvas.height = parseInt(canvasHeight.slice(0, -2))
  canvas.width = parseInt(canvasWidth.slice(0, -2))
  
  const { left, top } = window.getComputedStyle(image);
  const { width, height } = image.getBoundingClientRect();

  ctx.drawImage(
    image,
    parseInt(left.slice(0, -2)) - (width - image.width) / 2,
    parseInt(top.slice(0, -2)) - (height - image.height) / 2,
    width,
    height
  );

  // download canvas
  const imageOnCanvas = canvas.toDataURL()
  const downloadLink = document.createElement("a");
  downloadLink.href = imageOnCanvas
  downloadLink.download = "edited_image.png"
  downloadLink.click()
});
