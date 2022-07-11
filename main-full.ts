import { iterate } from './lib';

console.log('dropWhile', Array.from(iterate([1,2,3,4]).dropWhile((v) => v < 3)));
console.log('takeWhile', Array.from(iterate([1,2,3,4]).takeWhile((v) => v < 3)));
