
import { testDomain } from "../test.domain.js"; 

console.log("renderer loading");

console.log("testDomain: ", testDomain);
window.testDomain = testDomain;

console.log("Renderer finished loading");
