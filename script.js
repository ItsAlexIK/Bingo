const defaultPhrases = [
  "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15",
  "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25"
];

const card = document.getElementById('bingoCard');

defaultPhrases.forEach((text, index) => {
  const cell = document.createElement('div');
  cell.classList.add('bingo-cell');
  cell.textContent = text;
  cell.dataset.index = index;
  if (localStorage.getItem(`cell-${index}`) === 'selected') {
    cell.classList.add('selected');
  }
  cell.addEventListener('click', () => {
    cell.classList.toggle('selected');
    if (cell.classList.contains('selected')) {
      localStorage.setItem(`cell-${index}`, 'selected');
    } else {
      localStorage.removeItem(`cell-${index}`);
    }
    checkBingo();
  });
  card.appendChild(cell);
});

const cells = document.querySelectorAll('.bingo-cell');

function checkBingo() {
  const grid = [...cells].map(c => c.classList.contains('selected'));
  const lines = [];

  for (let r = 0; r < 5; r++) lines.push([0, 1, 2, 3, 4].map(c => r * 5 + c));
  for (let c = 0; c < 5; c++) lines.push([0, 1, 2, 3, 4].map(r => r * 5 + c));
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);

  cells.forEach(cell => cell.classList.remove('bingo'));

  for (const line of lines) {
    if (line.every(i => grid[i])) {
      line.forEach(i => cells[i].classList.add('bingo'));
    }
  }
}

function importFromText() {
  const raw = document.getElementById('textImportArea').value.trim().split('\n');
  if (raw.length !== 25) {
    return alert('You must enter exactly 25 lines (1 for each Bingo cell)');
  }

  cells.forEach((cell, i) => {
    cell.textContent = raw[i].trim();
    cell.classList.remove('selected', 'bingo');
    localStorage.removeItem(`cell-${i}`);
  });

  checkBingo();
}

function exportToText() {
  let output = '';
  cells.forEach(cell => {
    const mark = cell.classList.contains('selected') ? '[x]' : '[ ]';
    output += `${mark} ${cell.textContent}\n`;
  });

  navigator.clipboard.writeText(output).then(() => {
    alert('Copied current board to clipboard!');
  });
}

function resetBingo() {
  cells.forEach((cell, index) => {
    localStorage.removeItem(`cell-${index}`);
    cell.classList.remove('selected', 'bingo');
  });
}

checkBingo();
