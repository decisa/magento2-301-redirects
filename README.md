# Magento2 301 Redirects Script

script that adds 301 redirects to Magento 2 store and validates them.
script uses a hidden iframe, since form submission requires HTTPOnly cookies, which are not accessible via JavaScript.

need to provide an array of URL rewrites in the form of:

```javascript
const rewrites = [
  [request1, target1],
  [request2, target2],
  ...
  [requestN, targetN]
]
```

copy paste the whole script to console, while on URL Rewrites page in Magento2 admin area
