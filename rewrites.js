const requestPath = "inspiration/";
const targetPath = "/";
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
ifrm.setAttribute('src', link);
marker.parentNode.insertBefore(ifrm, marker);

function iframeLoaded(e){
  postMessage('iframe loaded');
  const doc = e.srcElement.contentDocument;
  
  const error = doc.querySelector('.message-error');
  if (error) {
    postMessage(error.firstElementChild.innerText);
    return;
  }

  const success = doc.querySelector('.message-success');
  if (success) {
    let result = 0;
    const urlToCheck = domain + requestPath;
    
    const message = `
      <div class="rewrite">
        <div class="path">
          <span>request</span><br>${requestPath}
        </div>
        <div class="path">
          <span>target</span><br>${targetPath}
        </div>
        <div class="link">
          <a href=${urlToCheck} target="_blank">link to check</a> code: <span id="test"></span>
        </div>
      </div>
    `;
    postMessage(message);
    fetch(urlToCheck)
    .then(response => {
      result = response.status;
      document.getElementById('test').innerHTML = result;
    })
    return;
  }

  let form = doc.getElementById('edit_form');
  submitRedirect(requestPath, targetPath, form);
}

function postMessage(text, container = notifications){
  container.innerHTML += `<p>${text}</p>`;
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
      postMessage('all good! found all required fields');
      postMessage(`request: "${form.request_path.value}", target: "${form.target_path.value}", type: ${form.redirect_type.value}`)
    }
    else {
      postMessage('301 redirect option was not found');
    }
    form.submit();
  }
  else {
    console.error('this is not a 301 redirect form. missing required inputs');
  }
}

function styles(){
  return `
  <style xml="space"><!--
    .rewrite {
      display: flex;
      flex-direction: row;
      border-top: 1px solid #333;
      padding: 5px 0;
      align-items: center;
    }
    .path {
      padding: 0 15px;
      width: 30%;
    }
    .path span {
      font-weight: 700;
      font-size: 10px;
    }
    .link {
      padding: 0 15px;
      width: 20%;
    }
  --></style>`;
}
