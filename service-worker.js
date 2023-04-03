
console.log("This prints to the console of the service worker (background script)")


async function getStorage(...keys) {
  let r = await chrome.storage.sync.get([...keys]);
  return keys.length == 1 ? r[keys[0]] : r;
}

async function setupStorageIfNecessary() {
  let setup = await getStorage('setup');
  
  if (setup === true) return;  // ✅

  console.log('🪁 Initialized storage!');
  await chrome.storage.sync.set({
    setup: true,
    deletes: {'ans': [], 'ask': [], 'penfriendsitem': [], 'thanksmsg': []}
  });
}

async function onComplete(dt) {
  if (dt.statusCode != 200) return;  // ❌

  await setupStorageIfNecessary();

  console.log(dt.url)
  if (dt.url.startsWith('https://stips.co.il/api?name=omniobj&rest_action=DELETE')) {
    console.log('A DELETION?!')
    let dels = await getStorage('deletes');

    // get type
    let type = dt.url.match('%22objType%22:%22(.+)%22')[1];

    // get timestamp
    let ts = Math.round(dt.timeStamp);

    dels[type].push(ts);  // add to db
    await chrome.storage.sync.set({deletes: dels}); // push

    console.log(`🗃️ Logged deletion of type ${type} at ${ts}`);
  }

  let dels = await getStorage('deletes');
  console.log(dels);
}

chrome.webRequest.onCompleted.addListener(onComplete, {urls: ['https://stips.co.il/api?name=omniobj&rest_action=DELETE*']})

