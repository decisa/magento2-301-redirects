const requestPath = "inspiration/";
const targetPath = "/";

const notificationsArea = document.getElementById('system_messages').parentNode;
const messagesElement = document.createElement('div');
messagesElement.setAttribute('id', 'rewrite_messages');
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



function iframeLoaded(){
  postMessage('iframe loaded');
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
      console.log('all good! found all required fields');
      console.log(`request: "${form.request_path.value}", target: "${form.target_path.value}", type: ${form.redirect_type.value}`)
    }
    else {
      console.error('301 redirect option was not found');
    }
    // form.submit();
  }
  else {
    console.error('this is not a 301 redirect form. missing required inputs');
  }
}

fetch(link)
.then(response => response.text())
.then(data => {
  let parser = new DOMParser();
  let page = parser.parseFromString(data, 'text/html');
  let form = page.getElementById('edit_form');
  submitRedirect(requestPath, targetPath, form);  
})
