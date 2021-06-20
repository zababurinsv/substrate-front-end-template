// import modules from '/substrate-front-end-template/static/html/components/varan-header/external/index.mjs'
customElements.define('org-main',
    class extends HTMLElement {
      constructor() {
        super()
        this.shadow = {}
        this.shadow.root =  this.attachShadow({ mode: "closed" });
        this.shadow.slot = document.createElement('slot')
        this.shadow.slot.name = 'host'
        this.shadow.root.appendChild(this.shadow.slot)
      }
      connectedCallback() {
        let style = document.createElement('style')
        style.innerText =  `@import '/substrate-front-end-template/public/static/html/components/varan-header/light/varan-header.css';`
        this.appendChild(style)
        var target = document.querySelector('div');
        const config = {
          attributes: true,
          childList: true,
          subtree: true
        };
        const callback = function(mutationsList, observer) {
          for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              // console.log('A child node has been added or removed.');
            } else if (mutation.type === 'attributes') {
              // console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
          }
        };
        const observer = new MutationObserver(callback);
        observer.observe(target, config);
      }
      disconnectedCallback() {
        console.log('disconnected callback');
      }
      componentWillMount() {
        console.log('component will mount');
      }
      componentDidMount() {
        console.log('component did mount');
      }
      componentWillUnmount() {
        console.log('component will unmount');
      }
      componentDidUnmount() {
        console.log('component did unmount');
      }
  })