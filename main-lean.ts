import { iterate } from './lib/lean';

// console.log('dropWhile', Array.from(iterate([1,2,3,4]).dropWhile((v) => v < 3))); // compiler error
console.log('dropWhile', (iterate([1,2,3,4]) as any).dropWhile);
// console.log('takeWhile', Array.from(iterate([1,2,3,4]).takeWhile((v) => v < 3))); // compiler error
console.log('takeWhile', (iterate([1,2,3,4]) as any).takeWhile);
