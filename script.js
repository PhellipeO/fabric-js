// Inicializa o canvas
const canvas = new fabric.Canvas("canvas");

// Exibir o menu clicado e esconder os outros
function showMenu(menuId) {
  document.querySelectorAll(".menu-content").forEach(menu => {
    menu.style.display = "none";
  });
  document.getElementById(menuId).style.display = "block";
}

// Adicionar Texto ao Canvas
function addText() {
  const textValue = document.getElementById("text-input").value;
  if (textValue) {
    const text = new fabric.Text(textValue, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: document.getElementById("text-color").value,
      fontFamily: document.getElementById("font-family").value,
      fontWeight: "normal",
      fontStyle: "normal",
      selectable: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  } else {
    alert("Por favor, digite um texto.");
  }
}

// Aplicar Negrito e Itálico
function setBold() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    activeObject.set("fontWeight", activeObject.fontWeight === "bold" ? "normal" : "bold");
    canvas.renderAll();
  }
}

function setItalic() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    activeObject.set("fontStyle", activeObject.fontStyle === "italic" ? "normal" : "italic");
    canvas.renderAll();
  }
}

// Substituir imagem selecionada
function replaceImage() {
  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (f) {
      fabric.Image.fromURL(f.target.result, function (img) {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === "image") {
          activeObject.setElement(img.getElement());
          canvas.renderAll();
        }
      });
    };
    reader.readAsDataURL(file);
  }
}

// Upload de imagem de fundo
function uploadBackground() {
  const fileInput = document.getElementById("background-input");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (f) {
      fabric.Image.fromURL(f.target.result, function (img) {
        img.scaleToWidth(canvas.width);
        img.scaleToHeight(canvas.height);
        img.selectable = false;
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    };
    reader.readAsDataURL(file);
  }
}
