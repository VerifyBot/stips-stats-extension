
function setData(dt, filterMethod) {
  for (const [type, data] of Object.entries(dt)) {
    const now = new Date();

    let count;

    switch (filterMethod) {
      case 'all':
        count = data.length;
        break;
      case 'daily':
        let day = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        count = data.filter(ts => ts > day.getTime()).length;
        break;
      case 'monthly':
        let month = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        count = data.filter(ts => ts > month.getTime()).length;
        break;
    }

    document.querySelector(`div.${type} .count`).textContent = String(count);
  }
}

async function main() {
  let dels = (await chrome.storage.sync.get('deletes')).deletes;
  setData(dels, 'all');
}

async function onFilter() {
  for (let btn of document.querySelectorAll('.filter button')) {
    btn.classList.remove("selected");
  }

  let filterMethod = this.getAttribute('method');

  this.classList.add("selected");

  let dels = (await chrome.storage.sync.get('deletes')).deletes;
  setData(dels, filterMethod);
}

for (let btn of document.querySelectorAll('.filter button')) {
  btn.addEventListener('click', onFilter);
}

main();