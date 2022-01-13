import sayHello from './lib/sayHello';
import MyScene from './scene.class';

window.addEventListener('load', () => {
  // fuctions
  sayHello();
  new MyScene();
})
