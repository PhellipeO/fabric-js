// Inicializa o canvas
const canvas = new fabric.Canvas("canvas");

// Tamanhos da área de impressão
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const marginCorte = 20;  // Margem para linha de corte
const marginSeguranca = 40; // Margem para linha de segurança (mais interna)

// Função para desenhar as linhas-guia
function drawGuides() {
  // Linha de Corte (pontilhada)
  const corte = new fabric.Rect({
    left: marginCorte / 2,
    top: marginCorte / 2,
    width: canvasWidth - marginCorte,
    height: canvasHeight - marginCorte,
    fill: "transparent",
    stroke: "black",
    strokeDashArray: [10, 5], // Estilo pontilhado
    strokeWidth: 2,
    selectable: false,
    evented: false
  });

  // Linha de Segurança (vermelha)
  const seguranca = new fabric.Rect({
    left: marginSeguranca / 2,
    top: marginSeguranca / 2,
    width: canvasWidth - marginSeguranca,
    height: canvasHeight - marginSeguranca,
    fill: "transparent",
    stroke: "red",
    strokeWidth: 2,
    selectable: false,
    evented: false
  });

  // Adiciona ao Canvas
  canvas.add(corte);
  canvas.add(seguranca);
}

// Desenha as linhas no início
drawGuides();

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
      fontSize: parseInt(document.getElementById('font-size').value) || 20,
      fill: document.getElementById("text-color").value,
      fontFamily: document.getElementById("font-family").value,
      fontWeight: "normal",
      fontStyle: "normal",
      selectable: true,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    // Adicionar à lista de textos
    adicionarTextoNaLista(text);
    
    // Limpar o input após adicionar
    document.getElementById("text-input").value = "";
  } else {
    alert("Por favor, digite um texto.");
  }
}

// Nova função para adicionar texto à lista
function adicionarTextoNaLista(textoObj) {
  const listTextos = document.querySelector('.texto-adicionados');
  
  const textoItem = document.createElement('div');
  textoItem.classList.add('texto-item');
  textoItem.innerHTML = `
    <span>${textoObj.text}</span>
    <div class="texto-acoes">
      <button onclick="editarTexto(this)">✏️</button>
      <button onclick="removerTexto(this)">❌</button>
    </div>
  `;
  
  listTextos.appendChild(textoItem);
}

// Função para editar texto da lista
function editarTexto(botao) {
  const textoItem = botao.closest('.texto-item');
  const textoSpan = textoItem.querySelector('span');
  
  // Encontrar o objeto de texto no canvas
  const textObj = canvas.getObjects().find(obj => 
    obj.type === 'text' && obj.text === textoSpan.textContent
  );
  
  if (textObj) {
    // Selecionar o objeto no canvas
    canvas.setActiveObject(textObj);
    
    // Preencher inputs com as propriedades atuais do texto
    document.getElementById('text-input').value = textObj.text;
    document.getElementById('text-color').value = textObj.fill;
    document.getElementById('font-family').value = textObj.fontFamily;
    document.getElementById('font-size').value = textObj.fontSize;

    // Destacar o texto na lista
    document.querySelectorAll('.texto-item').forEach(item => 
      item.classList.remove('selecionado')
    );
    textoItem.classList.add('selecionado');
  }
}

// Atualizando o texto no canvas
document.getElementById("text-input").addEventListener('input', function() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'text') {
    activeObject.set('text', this.value);  // Atualiza o texto diretamente
    canvas.renderAll();
    
    // Atualiza a lista de textos na interface
    const textoItem = document.querySelector('.texto-item.selecionado');
    if (textoItem) {
      textoItem.querySelector('span').textContent = this.value;  // Atualiza o texto na lista
    }
  }
});

// Função para sair do modo de edição e permitir nova inserção
function finalizarEdicao() {
  // Limpar o campo de texto
  document.getElementById('text-input').value = "";
  
  // Desmarcar a seleção do texto no canvas
  canvas.discardActiveObject();
  canvas.renderAll();
  
  // Limpar a seleção da lista
  document.querySelectorAll('.texto-item').forEach(item => 
    item.classList.remove('selecionado')
  );
}


// Função para remover texto da lista e do canvas
function removerTexto(botao) {
  const textoItem = botao.closest('.texto-item');
  const textoSpan = textoItem.querySelector('span');
  
  // Remover do canvas
  const textObj = canvas.getObjects().find(obj => 
    obj.type === 'text' && obj.text === textoSpan.textContent
  );
  
  if (textObj) {
    canvas.remove(textObj);
  }
  
  // Remover da lista
  textoItem.remove();
}

// Aplicar Negrito
function setBold() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'text') {
    activeObject.set('fontWeight', 
      activeObject.fontWeight === 'bold' ? 'normal' : 'bold'
    );
    canvas.renderAll();
  }
}

// Aplicar Itálico
function setItalic() {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === 'text') {
    activeObject.set('fontStyle', 
      activeObject.fontStyle === 'italic' ? 'normal' : 'italic'
    );
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

// Remover objeto selecionado
function removeObject() {
  const activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.remove(activeObject);
    
    // Remover da lista de textos se for um texto
    if (activeObject.type === 'text') {
      const textosAdicionados = document.querySelectorAll('.texto-item span');
      textosAdicionados.forEach(texto => {
        if (texto.textContent === activeObject.text) {
          texto.closest('.texto-item').remove();
        }
      });
    }
  }
}

// Salvar e carregar JSON
function saveAsJSON() {
  const json = JSON.stringify(canvas.toJSON());
  localStorage.setItem("canvasData", json);
  alert("Projeto salvo com sucesso!");
}

function loadFromJSON() {
  const json = localStorage.getItem("canvasData");
  if (json) {
    canvas.clear(); // Limpa o canvas atual
    drawGuides(); // Redesenha as linhas-guia
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      
      // Recriar a lista de textos
      const textoAdicionados = document.querySelector('.texto-adicionados');
      textoAdicionados.innerHTML = ''; // Limpa a lista atual
      
      // Adicionar textos que estavam no JSON
      canvas.getObjects().forEach(obj => {
        if (obj.type === 'text') {
          adicionarTextoNaLista(obj);
        }
      });
    });
  } else {
    alert("Nenhum projeto salvo encontrado.");
  }
}

// Salvar como imagem
function saveAsImage() {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1
  });
  
  const link = document.createElement('a');
  link.download = 'canvas-image.png';
  link.href = dataURL;
  link.click();
}

// Atalhos do teclado
document.addEventListener("keydown", function (event) {
  if (event.key === "Delete" || event.key === "Backspace") {
    removeObject();
  }
});

// Adicionar event listeners para atualização em tempo real
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('text-color').addEventListener('input', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fill', document.getElementById('text-color').value);
      canvas.renderAll();
    }
  });

  document.getElementById('font-family').addEventListener('change', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fontFamily', document.getElementById('font-family').value);
      canvas.renderAll();
    }
  });

  document.getElementById('font-size').addEventListener('input', () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set('fontSize', parseInt(document.getElementById('font-size').value));
      canvas.renderAll();
    }
  });
});