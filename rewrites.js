let form = document.getElementById('edit_form');

if (form.request_path && form.target_path && form.redirect_type) {
  form.request_path.value = '1';
  form.target_path.value = '2';
  const options = Array.from(form.redirect_type.options).map(x => x.value);
  const index = options.indexOf("301");
  if (index != -1) {
    form.redirect_type.selectedIndex = index;
  }
  else {
    console.error('301 redirect option was not found')
  }
  form.submit();
}
else {
  console.error('this is not a 301 redirect form. missing required inputs');
}
