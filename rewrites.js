const requestPath = "inspiration/";
const targetPath = "/";


const button = document.getElementById('add');
// find the link to add new URL rewrite page
const link = button.attributes.onclick.nodeValue.slice(13, -2);

fetch(link)
.then(response => response.text())
.then(data => {
  let parser = new DOMParser();
  let page = parser.parseFromString(data, 'text/html');
  let form = page.getElementById('edit_form');
  
  if (form.request_path && form.target_path && form.redirect_type) {
    form.request_path.value = requestPath;
    form.target_path.value = targetPath;
    const options = Array.from(form.redirect_type.options).map(x => x.value);
    const index = options.indexOf("301");
    if (index != -1) {
      form.redirect_type.selectedIndex = index;
      console.log('all good! found all required fields');
    }
    else {
      console.error('301 redirect option was not found');
    }
    // form.submit();
  }
  else {
    console.error('this is not a 301 redirect form. missing required inputs');
  }
})

