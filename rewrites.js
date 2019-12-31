const rewrites = [
  ["blog/2018/11/7-tips-for-buying-a-comfortable-sleeper-sofa-that-youll-want-to-spend-the-night-on/", "inspiration/7-tips-for-buying-a-comfortable-sleeper-sofa-that-youll-want-to-spend-the-night-on/"],
  ["blog/2018/10/office-furniture-buying-guide-6-tips-from-a-manager/", "inspiration/office-furniture-buying-guide-6-tips-from-a-manager/"]
];

const domain = "https://www.roomservice360.com/";

const notificationsArea = document.getElementById('system_messages').parentNode;
const messagesElement = document.createElement('div');
messagesElement.setAttribute('id', 'rewrite_messages');
notificationsArea.innerHTML += styles();
notificationsArea.append(messagesElement);
const notifications = document.getElementById('rewrite_messages');

const button = document.getElementById('add');
// find the link to add new URL rewrite page
const link = button.attributes.onclick.nodeValue.slice(13, -2);

// insert iframe
let marker = document.getElementById('anchor-content');
let ifrm = document.createElement('iframe');
ifrm.setAttribute('id', 'newRedirect');
ifrm.setAttribute('style', 'display: none');
ifrm.onload = iframeLoaded;
marker.parentNode.insertBefore(ifrm, marker);

// start processing redirects:
start(0);

function start(id = 0) {
  addRedirect(rewrites, 0);
}

function addRedirect(rewrites, id) {
  ifrm.setAttribute('request-path', rewrites[id][0]);
  ifrm.setAttribute('target-path', rewrites[id][1]);
  ifrm.setAttribute('rewrite-id', id);
  ifrm.setAttribute('src', link);
  console.log(`started running redirect id=${id}`);
}

function startNextRedirect(rewrites, currentId){
  let nextID = parseInt(currentId) + 1;
  if (nextID < rewrites.length) {
    addRedirect(rewrites, nextID)
  }
  else {
    console.log('finished');
  }
}

function iframeLoaded(e){
  if (!e.srcElement.attributes['request-path']) {
    // this is initial load of iframe, before request and target are set. skip this load
    return;
  }
  const doc = e.srcElement.contentDocument;
  const requestPath = e.srcElement.attributes['request-path'].value;
  const targetPath = e.srcElement.attributes['target-path'].value;
  const id = e.srcElement.attributes['rewrite-id'].value;
  
  const error = doc.querySelector('.message-error');
  if (error) {
    let result = 0;
    const urlToCheck = domain + requestPath;
    const message = rewriteReport(requestPath, targetPath, id, '#ffb471', error.firstElementChild.innerText);
    postMessage(message);

    fetch(urlToCheck)
    .then(response => {
      result = response.status;
      document.getElementById(`code${id}`).innerHTML = `<b>${result}</b>`;
      let container = document.getElementById(`link${id}`);
      if (result === 200) {
        container.setAttribute('style', `background-color: #b5f8c9`);
      } else {
        container.setAttribute('style', `background-color: #ff7084; color: #fff`);
      }
    })
    startNextRedirect(rewrites, id);
    return;
  }

  const success = doc.querySelector('.message-success');
  if (success) {
    let result = 0;
    const urlToCheck = domain + requestPath;
    const message = rewriteReport(requestPath, targetPath, id);
    postMessage(message);

    fetch(urlToCheck)
    .then(response => {
      result = response.status;
      document.getElementById(`code${id}`).innerHTML = `<b>${result}</b>`;
      let container = document.getElementById(`link${id}`);
      if (result === 200) {
        container.setAttribute('style', `background-color: #b5f8c9`);
      } else {
        container.setAttribute('style', `background-color: #ff7084; color: #fff`);
      }
    })
    startNextRedirect(rewrites, id);
    return;
  }

  let form = doc.getElementById('edit_form');
  submitRedirect(requestPath, targetPath, form);
}

function rewriteReport(requestPath, targetPath, id, background = null, errorMessage = null) {
  const message = `
      <div class="rewrite"${background ? ` style="background-color:${background}"` : ''}>
        <div class="counter">${parseInt(id) + 1}</div>
        <div class="path">
          <span>request</span><br>${requestPath}
        </div>
        <div class="path">
          <span>target</span><br>${targetPath}
        </div>
        <div class="link" id="link${id}">
          <a href=${domain + requestPath} target="_blank">link</a> code: <span id="code${id}"></span> ${errorMessage}
        </div>
      </div>`;
  return message; 
}

function postMessage(text, wrapper = null, style = null, container = notifications){
  let message = wrapper ? '<' + wrapper : '';
  message += style ? ` style="${style}"`: '';
  message += wrapper ? '>' : '';
  message += text;
  message += wrapper ? `</${wrapper}>` : '';
  container.innerHTML += message;
}

function submitRedirect(request, target, form){
  // submit is currently disabled !
  if (form.request_path && form.target_path && form.redirect_type) {
    form.request_path.value = request;
    form.target_path.value = target;
    const options = Array.from(form.redirect_type.options).map(x => x.value);
    const index = options.indexOf("301");
    if (index != -1) {
      form.redirect_type.selectedIndex = index;
      // postMessage('all good! found all required fields', 'p', 'color: cyan');
      // postMessage(`request: "${form.request_path.value}", target: "${form.target_path.value}", type: ${form.redirect_type.value}`, 'p', 'color: cyan');
    }
    else {
      postMessage('301 redirect option was not found', 'p', 'color: red');
    }
    form.submit();
  }
  else {
    postMessage('this is not a 301 redirect form. missing required inputs', 'p', 'color: red');
  }
}

function styles(){
  return `
  <style xml="space"><!--
    .rewrite {
      display: flex;
      flex-direction: row;
      border-top: 1px solid #333;
      padding: 0 5px;
      align-items: center;
    }
    .counter{
      width: 5%;
      text-align: center;
    }
    .path {
      padding: 0 15px;
      width: 35%;
    }
    .path span {
      font-weight: 700;
      font-size: 10px;
    }
    .link {
      padding: 10px;
      width: 25%;
    }
  --></style>`;
}
