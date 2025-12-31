
import { testDomain } from "../test.domain"; 

console.log("renderer loading");

console.log("testDomain: ", testDomain);
window.testDomain = testDomain;

console.log("Renderer finished loading");
