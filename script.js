// Inicializa o canvas
const canvas = new fabric.Canvas('canvas');

// Função para adicionar texto ao canvas
function addText() {
  const text = new fabric.Text(document.getElementById('text-input').value, {
    left: 100,
    top: 100,
    fontSize: 20,
    fill: 'black',
    fontFamily: 'Arial',
  });
  canvas.add(text);
  canvas.renderAll(); // Atualiza o canvas
}

// Função para carregar uma imagem no canvas
document.getElementById('image-input').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (f) {
    fabric.Image.fromURL(f.target.result, function (img) {
      img.scaleToWidth(200); // Redimensiona a imagem
      canvas.add(img);
      canvas.renderAll(); // Atualiza o canvas
    });
  };
  reader.readAsDataURL(file);
});

// Função para salvar o canvas como imagem
function saveCanvas() {
  const link = document.createElement('a');
  link.href = canvas.toDataURL({ format: 'png' });
  link.download = 'design.png';
  link.click();
}

// Função para trazer o objeto selecionado para frente
function bringForward() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.bringForward(); // Traz o objeto uma camada para frente
    canvas.renderAll(); // Atualiza o canvas
  }
}

// Função para enviar o objeto selecionado para trás
function sendBackward() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.sendBackwards(); // Envia o objeto uma camada para trás
    canvas.renderAll(); // Atualiza o canvas
  }
}

// Função para deletar o objeto selecionado
function deleteSelected() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject); // Remove o objeto do canvas
    canvas.renderAll(); // Atualiza o canvas
  }
}