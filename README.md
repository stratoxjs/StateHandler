# StateHandler
Platform-agnostic push state handler

### Usage
```js
let handler = new StateHandler();
//Access push state change
handler.state((updatedRoute) => {
	console.log('State update:', updatedRoute);
});
// push to state
handler.pushState('#why-hello-thar');
```
