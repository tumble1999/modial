# Native Bootstrap Model

```javascript
// @require      https://github.com/tumble1999/native-models/raw/master/native-model.js
```

```javascript
var model = new BSModal();

// or
model.setContent("Body");
// or
model.setContent("Header","Body","Footer");
//or
model.setContent({
header:"Header",
body:"Body",
footer:"Footer"
});

// or you can get the nodes to do things like append children or something
model.getHeaderNode()
model.getBodyNode()
model.getFooterNode()

model.show()
model.hide() 